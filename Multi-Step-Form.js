var inputs = document.querySelectorAll('input, textarea');
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', function () {
        if (!this.checkValidity()) {
            addErr(this);
        } else if (this.matches('[type=submit]')) {
            //console.log('submit clicked')
        } else if (this.value.length != 0) {
            this.closest('.js-form-control-section').classList.remove('error');
            let errlab = this.closest('.js-form-control-section').querySelector('label.error');
            if (errlab) {
                errlab.remove();
            }
        }
    });
}
function addErr(field) {
    fcontrol = field.closest('.js-form-control-section');
    fcontrol.classList.add('error');
}
$enrolForm = $("#enrol-form");
$tabs = $(".w-tab-link");
var $globalStepError = $(".step-global-error");
if ($enrolForm.length > 0) {
    var $formSteps = $(".js-form-steps .tab-link");
    if ($formSteps.length > 0) {
        var currentIndex = $(".js-form-steps .tab-link.w--current").index();
        //console.log("OnLoad: " + currentIndex);
    }
    var tab = $(".w-tab-link");
    $(tab).on('click', function () {
        $('html, body').animate({
            scrollTop: $('#enrol-form').position().top
        }, 'slow');
        const newIndex = $(this).index();
        const prevIndex = currentIndex;
        //console.log("From " + prevIndex + " to " + newIndex);
        for (i = 0; i < newIndex; i++) {
            validateSteps(i);
        }
        if (newIndex + 1 == $formSteps.length) {
            const $decl = $(".js-declaration-field input[type=checkbox]");
            if ($decl.is(":checked")) {
                $decl.change();
            }
            $('#next-button').addClass("hidden");
        } else{
            $('#next-button').removeClass("hidden");
        }
        if ($tabs.hasClass("error")) {
            $(".step-global-error").removeClass("hidden");
        } else {
            $(".step-global-error").addClass("hidden");
        }
        currentIndex = newIndex;
    });
    initFields();
    initFieldDependency();
}
function validateSteps(index) {
    var validate = validateFields(index);
    var $prevForm = $("#w-tabs-0-data-w-tab-" + index);
    var $stepIndicator = $prevForm.find(".step-indicator");
    if (validate) {
        $stepIndicator.html("&#9745;");
        $prevForm.removeClass("error");
        $prevForm.addClass("done");
    } else {
        $stepIndicator.html($stepIndicator.attr("data-step"));
        $prevForm.addClass("error");
        $prevForm.removeClass("done");
    }
}
function validateFields(currentIndex) {
    var result = false;
    var $currentContent = $("#w-tabs-0-data-w-pane-" + currentIndex);
    var $currFields = $([]);
    if ($currentContent.length > 0) {
        $currFields = $currentContent.find(".js-form-control-section");
    } else {
        $currFields = $(".js-form-control-section");
    }
    var valid = [];
    $.each($currFields, function () {
        var $this = $(this);
        var required = $this.attr("data-required");
        var msg = $this.data("error-msg");
        var maxLength = parseInt($this.attr("data-max-length"));
        var maxLengthErrorMessage = $this.data("data-max-length-error-msg");
        var input = $this.find(":input");
        input.removeClass("Invalid");
        var inputNotvalid = input.filter(function () {
            return !this.checkValidity();
        }).each(function () {
            this.classList.add('Invalid');
            //console.log(this.name, ' error message is ', this.validationMessage)
        })
        $this.find("label.error").remove();
        if (required == "true") {
            if (input.is(':radio') || input.is(':checkbox')) {
                if (input.is(':checked')) {
                    valid.push(true);
                } else {
                    valid.push(false);
                    $this.append("<label class='error'>" + msg + "</label>");
                    $this.addClass("error");
                }
            } else if ($this.find(".uploader-current").length > 0 && $this.find(".uploader-current").attr("style") != "display: none;") {
                valid.push(true);
                $this.removeClass("error");
            } else {
                if (input.val() == "") {
                    valid.push(false);
                    $this.append("<label class='error'>" + msg + "</label>");
                    $this.addClass("error");
                } else if (input.hasClass("Invalid")) {
                    valid.push(false);
                    $this.append("<label class='error'>" + msg + "</label>");
                    $this.addClass("error");
                } else {
                    valid.push(true);
                    $this.removeClass("error");
                }
            }
        } else {
            if (isNaN(maxLength) == false) {
                if (input.val() > maxLength) {
                    valid.push(false);
                    $this.append("<label class='error'>" + maxLengthErrorMessage + "</label>");
                    $this.addClass("error");
                }
            }
            if (input.hasClass("Invalid") && input.val()) {
                valid.push(false);
                $this.append("<label class='error'>" + msg + "</label>");
                $this.addClass("error");
            }
        }
    });
    if ($.inArray(false, valid) == -1) {
        return true;
    }
    return result;
}
function initFieldDependency() {
    var $depField = $("[data-dependants]").find(":input");
    if ($depField.length > 0) {
        $depField.on("change", function () {
            var $this = $(this);
            var $value = $this.val();
            var $dependants = $this.parents("[data-dependants]").data("dependants")
            var deps = [];
            deps = $dependants.split(";");
            $.each(deps, function (ii, oo) {
                if ($(oo).length > 0) {
                    var pepd = $(oo);
                    $.each(pepd, function (i, o) {
                    var dependencyValue = $(o).data("dependency-value") + "";
                    var required = $(o).attr("data-required");
                    var str = $value + "";
                    var depVal = dependencyValue + "";
                    if ($this.attr("multiple") == "multiple") {
                        if (str.indexOf(depVal) >= 0) {
                            $(o).removeClass("hidden").find(":input").prop("disabled", false);
                            if (required == "depends") {
                                $(o).attr("data-required", "true");
                            }
                        } else if (dependencyValue == 'null') {
                            if ($value.length == 0) {
                                //console.log('Empty' + $(o).attr('id'));
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            } else {
                                //console.log('Not Empty' + $(o).attr('id'));
                                if (required != "false") {
                                    $(o).attr("data-required", "depends");
                                    $(o).find("label.error").remove();
                                    $(o).removeClass("error");
                                }
                            }
                        } else {
                            $(o).addClass("hidden").find(":input").prop("disabled", true);
                            if (required != "false") {
                                $(o).attr("data-required", "depends");
                            }
                        }
                    } else if (dependencyValue.indexOf(";") >= 0) {
                        if (depVal.indexOf(str) >= 0) {
                            $(o).removeClass("hidden").find(":input").prop("disabled", false);
                            if (required == "depends") {
                                $(o).attr("data-required", "true");
                            }
                        } else {
                            $(o).addClass("hidden").find(":input").prop("disabled", true);
                            if (required != "false") {
                                $(o).attr("data-required", "depends");
                            }
                        }
                    } else if (dependencyValue == 'null') {
                        if ($value.length == 0) {
                            //console.log('Empty' + $(o).attr('id'));
                            if (required == "depends") {
                                $(o).attr("data-required", "true");
                            }
                        } else {
                            //console.log('Not Empty' + $(o).attr('id'));
                            if (required != "false") {
                                $(o).attr("data-required", "depends");
                                $(o).find("label.error").remove();
                                $(o).removeClass("error");
                            }
                        }
                    } else if ($this.is(":checkbox")) {
                        if (dependencyValue == "1") {
                            if ($this.is(":checked")) {
                                $(o).removeClass("hidden").find(":input").prop("disabled", false);
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                            if (!$this.is(":checked")) {
                                $(o).addClass("hidden").find(":input").prop("disabled", true);
                                if (required == "true") {
                                    $(o).attr("data-required", "depends");
                                }
                            }
                        }
                        if (dependencyValue == "0") {
                            if (!$this.is(":checked")) {
                                $(o).removeClass("hidden").find(":input").prop("disabled", false);
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                            if ($this.is(":checked")) {
                                $(o).addClass("hidden").find(":input").prop("disabled", true);
                                if (required == "true") {
                                    $(o).attr("data-required", "depends");
                                }
                            }
                        }
                    } else {
                        if (dependencyValue == $value || $value.indexOf(dependencyValue + ";") >= 0 ) {
                            $(o).removeClass("hidden").find(":input").prop("disabled", false);
                            if (required == "depends") {
                                $(o).attr("data-required", "true");
                            }
                        } else {
                            $(o).addClass("hidden").find(":input").prop("disabled", true);
                            if (required != "false") {
                                $(o).attr("data-required", "depends");
                            }
                        }
                    }
                });
                }
            });
        });
        $.each($depField, function (i, o) {
            var $this = $(this);
            var $value = $this.val();
            var $dependants = $this.parents("[data-dependants]").data("dependants")
            var deps = [];
            deps = $dependants.split(";");
            $.each(deps, function (i, o) {
                if ($(o).length > 0) {
                    var dependencyValue = $(o).data("dependency-value") + "";
                    var required = $(o).attr("data-required");
                    var str = $value + "";
                    var depVal = dependencyValue + "";
                    if ($this.attr("multiple") == "multiple") {
                        if (str.indexOf(depVal) >= 0) {
                            $(o).removeClass("hidden").find(":input").prop("disabled", false);
                            if (required == "depends") {
                                $(o).attr("data-required", "true");
                            }
                        }
                        if (dependencyValue == 'null') {
                            if ($value.length == 0) {
                                //console.log($(o).attr('id'));
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                        }
                    } else if (dependencyValue.indexOf(";") >= 0) {
                        if ($this.is(":checked")) {
                            if (depVal.indexOf(str) >= 0) {
                                $(o).removeClass("hidden").find(":input").prop("disabled", false);
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                        }
                    } else {
                        if (dependencyValue == 'null') {
                            if ($value.length == 0) {
                                //console.log($(o).attr('id'));
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                        }
                        if (dependencyValue == $value) {
                            if ($this.attr("type") == "radio") {
                                if ($this.is(":checked")) {
                                    $(o).removeClass("hidden").find(":input").prop("disabled", false);
                                    if (required == "depends") {
                                        $(o).attr("data-required", "true");
                                    }
                                }
                            } else {
                                $(o).removeClass("hidden").find(":input").prop("disabled", false);
                                if (required == "depends") {
                                    $(o).attr("data-required", "true");
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}
function initFields() {
    var $declaration = $(".js-declaration-field input[type=checkbox]");
    var $tabs = $(".tab-link");
    $declaration.on("change", function () {
        var stepindex = $(".js-form-steps .tab-link.w--current").index();
        //console.log(stepindex);
        for (i = 0; i <= stepindex; i++) {
            validateSteps(i);
        }
        if ($tabs.hasClass("error")) {
            $(".step-global-error").removeClass("hidden");
            $(".submit-wrapper-placeholder").removeClass("hidden");
            $("#submit-wrapper").addClass("hidden");
        } else {
            $(".step-global-error").addClass("hidden");
            if ($declaration.is(":checked")) {
                $(".submit-wrapper-placeholder").addClass("hidden");
                $("#submit-wrapper").removeClass("hidden");
            } else {
                $(".submit-wrapper-placeholder").removeClass("hidden");
                $("#submit-wrapper").addClass("hidden");
            }
        }
    });
    var $requiredField = $(".js-form-control-section :input").not(".hidden");
    $requiredField.on("change", function () {
        var $this = $(this);
        var $parent = $this.parents(".js-form-control-section");
        var required = $parent.attr("data-required");
        if (required == "true") {
            if ($this.is(':radio') || $this.is(':checkbox')) {
                if ($this.is(':checked')) {
                    $parent.find("label.error").remove();
                    $parent.removeClass("error");
                }
            } else {
                if ($this.val() != "") {
                    //console.log('changes');
                    $parent.find("label.error").remove();
                    $parent.removeClass("error");
                }
            }
        }
    });
}
