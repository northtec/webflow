const form = document.querySelector('.form-control-wrapper').closest('form');

if (form.length > 0) {
  var inputs = form.querySelectorAll('input, textarea');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', function () {
      if (!this.checkValidity()) {
        addErr(this);
      } else if (this.value.length != 0) {
        const fieldWrapper = this.closest('.js-form-control-section');
        if (fieldWrapper) {
          fieldWrapper.classList.remove('error');
          const errlab = fieldWrapper.querySelector('label.error');
          if (errlab) errlab.remove();
        }
      }
    });
  }

  document
    .querySelector('#js-submit-btn')
    .addEventListener('click', function (event) {
      const formvalid = validateFields();
      if (formvalid) {
        form.querySelector("input[type='submit']").click();
      }
    });

  initFields();
  initFieldDependency();
}

function addErr(field) {
  const fcontrol = field.closest('.js-form-control-section');
  fcontrol.classList.add('error');
  field.classList.add('Invalid');
}

function validateFields() {
  var result = false;
  var $currentContent = $('.form-control-wrapper').closest('form');
  var $currFields = $([]);
  if ($currentContent.length > 0) {
    $currFields = $currentContent.find('.js-form-control-section');
  } else {
    $currFields = $('.js-form-control-section');
  }
  var valid = [];
  $.each($currFields, function () {
    var $this = $(this);
    var required = $this.attr('data-required');
    var msg = $this.data('error-msg');
    var maxLength = parseInt($this.attr('data-max-length'));
    var maxLengthErrorMessage = $this.data('data-max-length-error-msg');
    var input = $this.find(':input');
    input.removeClass('Invalid');
    var inputNotvalid = input
      .filter(function () {
        return !this.checkValidity();
      })
      .each(function () {
        this.classList.add('Invalid');
        //console.log(this.name, ' error message is ', this.validationMessage)
      });
    $this.find('label.error').remove();
    if (required == 'true') {
      if (input.is(':radio') || input.is(':checkbox')) {
        if (input.is(':checked')) {
          valid.push(true);
        } else {
          valid.push(false);
          $this.append("<label class='error'>" + msg + '</label>');
          $this.addClass('error');
        }
      } else if (
        $this.find('.uploader-current').length > 0 &&
        $this.find('.uploader-current').attr('style') != 'display: none;'
      ) {
        valid.push(true);
        $this.removeClass('error');
      } else {
        if (input.val() == '') {
          valid.push(false);
          $this.append("<label class='error'>" + msg + '</label>');
          $this.addClass('error');
        } else if (input.hasClass('Invalid')) {
          valid.push(false);
          $this.append("<label class='error'>" + msg + '</label>');
          $this.addClass('error');
        } else {
          valid.push(true);
          $this.removeClass('error');
        }
      }
    } else {
      if (isNaN(maxLength) == false) {
        if (input.val() > maxLength) {
          valid.push(false);
          $this.append(
            "<label class='error'>" + maxLengthErrorMessage + '</label>'
          );
          $this.addClass('error');
        }
      }
      if (input.hasClass('Invalid') && input.val()) {
        valid.push(false);
        $this.append("<label class='error'>" + msg + '</label>');
        $this.addClass('error');
      }
    }
  });
  if ($.inArray(false, valid) == -1) {
    return true;
  }
  return result;
}

function initFieldDependency() {
  var $depField = $('[data-dependants]').find(':input');
  if ($depField.length > 0) {
    $depField.on('change', function () {
      var $this = $(this);
      var $value = $this.val();
      var $dependants = $this.parents('[data-dependants]').data('dependants');
      var deps = [];
      deps = $dependants.split(';');
      $.each(deps, function (ii, oo) {
        if ($(oo).length > 0) {
          var pepd = $(oo);
          $.each(pepd, function (i, o) {
            var dependencyValue = $(o).data('dependency-value') + '';
            var required = $(o).attr('data-required');
            var str = $value + '';
            var depVal = dependencyValue + '';
            const depArr = depVal.split(';');
            const wildcards = depArr
              .filter((str) => str.startsWith('*') && str.endsWith('*'))
              .map((s) => s.slice(1, -1));
            if ($this.attr('multiple') == 'multiple') {
              if (str.indexOf(depVal) >= 0) {
                $(o)
                  .removeClass('hidden')
                  .find(':input')
                  .prop('disabled', false);
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              } else if (dependencyValue == 'null') {
                if ($value.length == 0) {
                  //console.log('Empty' + $(o).attr('id'));
                  if (required == 'depends') {
                    $(o).attr('data-required', 'true');
                  }
                } else {
                  //console.log('Not Empty' + $(o).attr('id'));
                  if (required != 'false') {
                    $(o).attr('data-required', 'depends');
                    $(o).find('label.error').remove();
                    $(o).removeClass('error');
                  }
                }
              } else {
                $(o).addClass('hidden').find(':input').prop('disabled', true);
                if (required != 'false') {
                  $(o).attr('data-required', 'depends');
                }
              }
            } else if (dependencyValue.indexOf(';') >= 0) {
              if (str && depVal.indexOf(str) >= 0) {
                $(o)
                  .removeClass('hidden')
                  .find(':input')
                  .prop('disabled', false);
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              } else {
                $(o).addClass('hidden').find(':input').prop('disabled', true);
                if (required != 'false') {
                  $(o).attr('data-required', 'depends');
                }
              }
              if (wildcards.length) {
                wildcards.forEach((val) => {
                  if (str.includes(val)) {
                    $(o)
                      .removeClass('hidden')
                      .find(':input')
                      .prop('disabled', false);
                    if (required == 'depends') {
                      $(o).attr('data-required', 'true');
                    }
                  }
                });
              }
            } else if (dependencyValue == 'null') {
              if ($value.length == 0) {
                //console.log('Empty' + $(o).attr('id'));
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              } else {
                //console.log('Not Empty' + $(o).attr('id'));
                if (required != 'false') {
                  $(o).attr('data-required', 'depends');
                  $(o).find('label.error').remove();
                  $(o).removeClass('error');
                }
              }
            } else if ($this.is(':checkbox')) {
              if (dependencyValue == '1') {
                if ($this.is(':checked')) {
                  $(o)
                    .removeClass('hidden')
                    .find(':input')
                    .prop('disabled', false);
                  if (required == 'depends') {
                    $(o).attr('data-required', 'true');
                  }
                }
                if (!$this.is(':checked')) {
                  $(o).addClass('hidden').find(':input').prop('disabled', true);
                  if (required == 'true') {
                    $(o).attr('data-required', 'depends');
                  }
                }
              }
              if (dependencyValue == '0') {
                if (!$this.is(':checked')) {
                  $(o)
                    .removeClass('hidden')
                    .find(':input')
                    .prop('disabled', false);
                  if (required == 'depends') {
                    $(o).attr('data-required', 'true');
                  }
                }
                if ($this.is(':checked')) {
                  $(o).addClass('hidden').find(':input').prop('disabled', true);
                  if (required == 'true') {
                    $(o).attr('data-required', 'depends');
                  }
                }
              }
            } else {
              if (
                dependencyValue == $value ||
                $value.indexOf(dependencyValue + ';') >= 0
              ) {
                $(o)
                  .removeClass('hidden')
                  .find(':input')
                  .prop('disabled', false);
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              } else {
                $(o).addClass('hidden').find(':input').prop('disabled', true);
                if (required != 'false') {
                  $(o).attr('data-required', 'depends');
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
      var $dependants = $this.parents('[data-dependants]').data('dependants');
      var deps = [];
      deps = $dependants.split(';');
      $.each(deps, function (i, o) {
        if ($(o).length > 0) {
          var dependencyValue = $(o).data('dependency-value') + '';
          var required = $(o).attr('data-required');
          var str = $value + '';
          var depVal = dependencyValue + '';
          if ($this.attr('multiple') == 'multiple') {
            if (str.indexOf(depVal) >= 0) {
              $(o).removeClass('hidden').find(':input').prop('disabled', false);
              if (required == 'depends') {
                $(o).attr('data-required', 'true');
              }
            }
            if (dependencyValue == 'null') {
              if ($value.length == 0) {
                //console.log($(o).attr('id'));
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              }
            }
          } else if (dependencyValue.indexOf(';') >= 0) {
            if ($this.is(':checked')) {
              if (depVal.indexOf(str) >= 0) {
                $(o)
                  .removeClass('hidden')
                  .find(':input')
                  .prop('disabled', false);
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              }
            }
          } else {
            if (dependencyValue == 'null') {
              if ($value.length == 0) {
                //console.log($(o).attr('id'));
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
                }
              }
            }
            if (dependencyValue == $value) {
              if ($this.attr('type') == 'radio') {
                if ($this.is(':checked')) {
                  $(o)
                    .removeClass('hidden')
                    .find(':input')
                    .prop('disabled', false);
                  if (required == 'depends') {
                    $(o).attr('data-required', 'true');
                  }
                }
              } else {
                $(o)
                  .removeClass('hidden')
                  .find(':input')
                  .prop('disabled', false);
                if (required == 'depends') {
                  $(o).attr('data-required', 'true');
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
  var $requiredField = $('.js-form-control-section :input').not('.hidden');
  $requiredField.on('change', function () {
    var $this = $(this);
    var $parent = $this.parents('.js-form-control-section');
    var required = $parent.attr('data-required');
    if (required == 'true') {
      if ($this.is(':radio') || $this.is(':checkbox')) {
        if ($this.is(':checked')) {
          $parent.find('label.error').remove();
          $parent.removeClass('error');
        }
      } else {
        if ($this.val() != '') {
          $parent.find('label.error').remove();
          $parent.removeClass('error');
        }
      }
    }
  });
}
