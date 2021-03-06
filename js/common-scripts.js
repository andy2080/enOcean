//initial toastr
toastr.options = {
  "closeButton": false,
  "progressBar": true,
  "debug": false,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};


// custom sidebar scrollbar
$(".sidebar").niceScroll({ styler: "fb", cursorcolor: "#e8403f", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled: false, cursorborder: '', scrollspeed: 60 });


//sidebar show/hide animate
$('div.sidebar').ready(function () {
  if (document.body.clientWidth <= 768) {
    var top = 59 - parseInt($('div.sidebar').css("height"));
    $('div.sidebar').css("top", top + "px");
    setTimeout("$('div.sidebar').css('display','block');", 100);
  }
});

$('.sidebar-toggle').click(function (event) {
  if (document.body.clientWidth > 768) {
    if ($('div.content').css("marginLeft") == "0px") {
      $('div.content').animate({ marginLeft: '210px' }, 400);
      $('div.sidebar').animate({ marginLeft: '0px' }, 400);
    } else {
      $('div.content').animate({ marginLeft: '0px' }, 400);
      $('div.sidebar').animate({ marginLeft: '-210px' }, 400);
    }
  } else {
    if ($('div.sidebar').css("top") == "60px") {
      var top = 59 - parseInt($('div.sidebar').css("height"));
      $('div.sidebar').animate({ top: top + "px" }, 200);
    } else {
      $('div.sidebar').animate({ top: "60px" }, 200);
    }
    event.stopPropagation();
    //when sidebar display,click document can hide sidebar menu
    document.addEventListener('click', function (event) {
      var top = 59 - parseInt($('div.sidebar').css("height"));
      $('div.sidebar').animate({ top: top + "px" }, 200);
    });
  }
});


//sidebar menu animate
(function () {
  var sidebarItems = document.getElementsByClassName('submenu');
  for (var i = 0; i < sidebarItems.length; i++) {
    sidebarItems[i].index = i;
    sidebarItems[i].addEventListener('click', function (event) {
      if ($(this).hasClass('active')) {
        this.className = "submenu";
      } else {
        this.className = "submenu active";
      }
    }, false);
  }

  $('.sub').click(function (event) {
    event.stopPropagation();
  });

  $('#addDeviceHeader').click(function () {
    $('#addDeviceModal').modal('show');
  });

  $('#addControllerHeader').click(function () {
    $('#addControllerModal').modal('show');
  });
})();

//stop propagation,otherwise clicking sidebar item will triggle document's click event
//then will hide sidebar,this is not what we want
$('.sidebar').click(function (event) {
  event.stopPropagation();
});

/*----------------------some thing about device and controller start---------------------------*/

//add and delete device
$('#addDeviceModalConfirm').click(function () {
  var deviceName = $('#deviceName').val();
  var deviceRemark = $('#deviceRemark').val();
  if (deviceName == "" || deviceRemark == "") {
    toastr.info("请把表单输入完整!");
  } else {
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "add_device",
        deviceName: deviceName,
        deviceRemark: deviceRemark
      },
      success: function (data) {
        if (data.state == "add_device_success") {
          $('#addDeviceModal').modal('hide');
          toastr.success("设备添加成功，刷新页面即可加载新数据！");
        } else if (data.state == "add_device_failed") {
          toastr.error("设备添加成功，刷新页面即可加载新数据！");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  }
});

//delete device
$('.deleteDevice').click(function () {
  $('#deleteDeviceConfirm').attr("data-deviceid", this.getAttribute("data-deviceid"));
  $('.modal-title > .deleteTitle').text($(this).parent().parent().children()[0].innerHTML);
});

$('#deleteDeviceConfirm').click(function () {
  var verifycode = $('.verifycodeInput').val();
  var deviceId = $('#deleteDeviceConfirm').attr("data-deviceId");
  if (verifycode == "") {
    toastr.info("请填写验证码");
  } else {
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "delete_device",
        deviceId: deviceId,
        verifycode: verifycode
      },
      success: function (data) {
        if (data.state == "delete_device_success") {
          $('#deleteDevice').modal("hide");
          toastr.success("删除设备信息成功");
          $('.verifycodeInput').val("")
        } else if (data.state == "delete_device_failed") {
          toastr.error("修改失败，请重试");
        } else if (data.state == "verifycode_wrong") {
          toastr.error("验证码错误，请重新输入");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  }
});

//modify device infomation
$('.modifyDevice').click(function () {
  $('#modifyDeviceConfirm').attr("data-deviceid", this.getAttribute("data-deviceid"));
  $('.modal-title > .modifyTitle').text($(this).parent().parent().children()[0].innerHTML);
});

$('#modifyDeviceConfirm').click(function () {
  var deviceName = $('#modifyDeviceName').val();
  var deviceRemark = $('#modifyDeviceRemark').val();
  if (deviceName == "" || deviceRemark == "") {
    toastr.info("请将表单填写完整！");
  } else {
    var deviceId = this.getAttribute("data-deviceid");
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "modify_device",
        deviceId: deviceId,
        deviceName: deviceName,
        deviceRemark: deviceRemark
      },
      success: function (data) {
        if (data.state == "modify_device_success") {
          $('#modifyDevice').modal("hide");
          toastr.success("修改设备信息成功");
          $('#modefyDeviceName').val("");
          $('#modifyDeviceRemark').val("");
        } else if (data.state == "modify_device_failed") {
          toastr.error("修改失败，请重试");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  }
});


//add controller
$('#controllerType').change(function () {
  switch (this.selectedIndex) {
    //switcher
    case 0:
      $('.selectMode').addClass('hide');
      $('.sliderMode').addClass('hide');
      break;
    //selector
    case 1:
      $('.selectMode').removeClass('hide');
      $('.sliderMode').addClass('hide');
      break;
    //slider
    case 2:
      $('#modeName').text("输入滑块控制范围");
      $('.selectMode').addClass('hide');
      $('.sliderMode').removeClass('hide');
      break;
    //chart
    case 3:
      $('#modeName').text("输入数值正常范围");
      $('.selectMode').addClass('hide');
      $('.sliderMode').removeClass('hide');

  }
});

//add all kinds of controllers
$('#serialInput').bind("blur", function(){
  $.ajax({
    type: "GET",
    url: "./functions.php",
    dataType: 'json',
    data: {
      type: "controller_exist",
      controllerId: this.value
    },
    success: function (data) {
      if(data.state) {
        $('.fa.serial').removeClass('none').removeClass('fa-close').addClass('fa-check');
      } else {
        $('.fa.serial').removeClass('none').removeClass('fa-check').addClass('fa-close');
      }
    },
    error: function () {
      toastr.clear();
      toastr.error("发生错误：");
    }
  });
});


$('#addControllerConfirm').click(function () {
  if (!$('.fa.serial').hasClass('fa-check')) {
    toastr.info("请输入正确的控制器编号");
    return ;
  }
  var controllerId = $('#serialInput').val();
  var controllerName = $('#controllerName').val();
  var deviceSelecter = $('#select-bindDevice')[0];
  var deviceId = deviceSelecter.options[deviceSelecter.selectedIndex].value;
  var typeId = $('#controllerType').get(0).selectedIndex + 1;
  var modeNames = $('#modeNamesInput').val();
  var minValue = "0";
  var maxValue = "1";
  switch (typeId) {
    //switcher
    case 1:
      var minValue = "0";
      var maxValue = "1";
      modeNames = "";
      break;
    //selector
    case 2:
      var minValue = "0";
      var maxValue = modeNames.split(" ").length.toString();
      break;
    //slider and chart
    case 3:
    case 4:
      var minValue = $('#minValueInput').val();
      var maxValue = $('#maxValueInput').val();
      modeNames = "";
      break;
  }
  $.ajax({
    type: "GET",
    url: "./functions.php",
    dataType: 'json',
    data: {
      type: "add_controller",
      controllerId: controllerId,
      controllerType: typeId,
      controllerName: controllerName,
      deviceId: deviceId,
      modeNames: modeNames,
      minValue: minValue,
      maxValue: maxValue
    },
    success: function (data) {
      if (data.state == "add_controller_success") {
        toastr.success("添加成功");
        $('#addControllerModal').modal('hide');
        $('#controllerName').val("");
      } else if (data.state == "add_controller_failed") {
        toastr.error("添加失败，请重试");
      }
    },
    error: function () {
      toastr.clear();
      toastr.error("发生错误：");
    }
  });
});

//delete controller
$('.deleteController').click(function () {
  $('#deleteControllerConfirm').attr("data-controllerid", this.getAttribute("data-controllerid"));
  $(this).parent().parent().addClass("deleteTarget");
});

$('#deleteControllerConfirm').click(function () {
  var password = $("#deleteControllerInput").val();
  if (password == "") {
    toastr.info("请将表单填写完整"); 
  } else {
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "delete_controller",
        controllerId: this.getAttribute("data-controllerid"),
        password: password
      },
      success: function (data) {
        if (data.state == "delete_controller_success") {
          $('#deleteController').modal("hide");
          $('.deleteTarget').animate({ "opacity": "0" }, 1000);
          setTimeout("$('.deleteTarget').remove();", 1000);
          toastr.success("删除控制器信息成功");
          $('#deleteControllerInput').val("");
        } else if (data.state == "delete_controller_failed") {
          toastr.error("修改失败，请重试");
        } else if (data.state == "password_incorrect") {
          toastr.error("密码输入错误");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  }
});

//modify controller
$('.midifyController').click(function () {
  $('#modifyControllerConfirm').attr("data-controllerid", this.getAttribute("data-controllerid"));
  var nametd = $(this).parents('tr').children()[0];
  nametd.className = "targetController";
  $('#modifyControllerName').val(nametd.innerHTML);
});

$('#modifyControllerConfirm').click(function () {
  var controllerName = $('#modifyControllerName').val();
  if (controllerName == "") {
    toastr.info("请将表单填写完整");
  } else {
    var controllerId = this.getAttribute("data-controllerid");
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "modify_controller",
        controllerId: controllerId,
        controllerName: controllerName
      },
      success: function (data) {
        if (data.state == "modify_controller_success") {
          $('.targetController').text(controllerName).removeClass('targetController');
          $('#modifyController').modal("hide");
          toastr.success("修改控制器信息成功");
          $('#modifyControllerName').val("");
        } else if (data.state == "modify_controller_failed") {
          toastr.error("修改失败，请重试");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  }
});


//change controller data
function changeControllerData(controllerId, data) {
  $.ajax({
    type: "GET",
    url: "./functions.php",
    dataType: 'json',
    data: {
      type: "change_controller_data",
      controllerId: controllerId,
      data: data
    },
    success: function (data) {
      if (data.state == "change_controller_data_success") {
        toastr.success("更新成功！");
      } else if (data.state == "change_controller_data_failed") {
        toastr.error("修改失败，请重试");
      }
    },
    error: function () {
      toastr.clear();
      toastr.error("发生错误：");
    }
  });
}

/*----------------------some thing about device and controller end---------------------------*/

//alert
if ($('#deviceState').hasClass('label-info')) {
  $('.alert').css("display", "block");
}

/*panel animation---device*/
jQuery('.panel .tools .fa-chevron-down').click(function () {
  var el = jQuery(this).parents(".panel").children(".panel-body");
  if (jQuery(this).hasClass("fa-chevron-down")) {
    jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    el.slideUp(200);
  } else {
    jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    el.slideDown(200);
  }
});

jQuery('.fa.fa-times').click(function () {
  var el = this.parentNode.parentNode.parentNode.parentNode;
  el.style.display = 'none'
});


/*switcher animation---device*/
$('.switch-animate').click(function () {
  if (jQuery(this).hasClass("switch-on")) {
    jQuery(this).removeClass("switch-on").addClass("switch-off");
    //update data in database
    if ($(this).hasClass("setting")) {

    } else {
      changeControllerData(this.getAttribute("data-controllerid"), 0);
    }
  } else {
    jQuery(this).removeClass("switch-off").addClass("switch-on");
    //update data in database
    if ($(this).hasClass("setting")) {

    } else {
      changeControllerData(this.getAttribute("data-controllerid"), 1);
    }
  }
});

/*selector */
$('.selector').change(function () {
  changeControllerData(this.getAttribute("data-controllerid"), this.selectedIndex);
});

/*slider animation---device*/

$('.ui-slider-handle').mousedown(function (event) {
  var container = $(this).parents(".slider").parents(".slider-container")[0];
  $(container).attr("data-offsetwidth", container.offsetWidth);
  $(container).addClass("ui-state-move");
  $('.ui-state-move').attr("data-startx", container.getBoundingClientRect().left);
});

$('.ui-slider-handle').each(function () {
  this.addEventListener("touchstart", function () {
    var container = $(this).parents(".slider").parents(".slider-container")[0];
    $(container).attr("data-offsetwidth", container.offsetWidth);
    $(container).addClass("ui-state-move");
    $('.ui-state-move').attr("data-startx", container.getBoundingClientRect().left);
  });
  this.addEventListener("touchmove", function () {
    console.log("move");
    var rangeWidth = $('.ui-state-move').attr("data-offsetwidth");
    var startX = $('.ui-state-move').attr("data-startx");
    var offsetX = event.clientX - startX;
    var leftValue = offsetX / rangeWidth * 100;
    if (leftValue >= 0 && leftValue <= 100) {
      console.log(leftValue);
      $('.ui-state-move .ui-slider-handle').css("left", leftValue + "%");
      $('.ui-state-move .ui-slider-range').css("width", leftValue + "%");
      $('.ui-state-move #slider-amount').text(Math.round(leftValue));
    }
  });
  this.addEventListener("touchend", function () {
    console.log("end");
    $('.ui-state-move').removeClass("ui-state-move");
  });
});

document.onmousemove = function (event) {
  var rangeWidth = $('.ui-state-move').attr("data-offsetwidth");
  var startX = $('.ui-state-move').attr("data-startx");
  var offsetX = event.clientX - startX;
  var leftValue = offsetX / rangeWidth * 100;
  if (leftValue >= 0 && leftValue <= 100) {
    if (leftValue > 99.5) {
      leftValue = 100;
    } else if (leftValue < 0.3) {
      leftValue = 0;
    }
    $('.ui-state-move .ui-slider-handle').css("left", leftValue + "%");
    $('.ui-state-move .ui-slider-range').css("width", leftValue + "%");
    var max = $('.ui-state-move #slider-amount').attr("data-max");
    var min = $('.ui-state-move #slider-amount').attr("data-min");
    var mount = parseFloat(min) + parseFloat((max - min) * (leftValue / 100));
    $('.ui-state-move #slider-amount').text(Math.floor(mount));
  }
};

document.onmouseup = function (event) {
  if ($('.ui-state-move').length != 0) {
    changeControllerData($('.ui-state-move').attr("data-controllerid"), $('.ui-state-move #slider-amount').text());
    $('.ui-state-move').removeClass("ui-state-move");
  }

};





/*profile modified-- profile page */

(function () {

  var btnUpdate = document.getElementById('profile-update');
  if (!btnUpdate) {
    return;
  }
  var inputNickname = document.getElementById('nickname-profile');
  var inputPersonal = document.getElementById('personal-profile');
  var inputFile = document.getElementById('file');
  var btnRemove = document.getElementById('photo-remove');
  inputNickname.onkeypress = inputNickname.onchange = enableUpdate;
  inputPersonal.onkeypress = inputPersonal.onchange = enableUpdate;

  inputFile.onchange = function () {
    enableUpdate();
    console.log(inputFile.value);
  }

  //delete input file
  btnRemove.onclick = function () {
    $('.fileupload-preview').empty();
    $('.fileupload.fileupload-exists').removeClass('fileupload-exists').addClass('fileupload-new');
    inputFile.value = "";
  }

  function enableUpdate() {
    btnUpdate.disabled = false;
  }

  function disableUpdate() {
    btnUpdate.disabled = true;
  }

  btnUpdate.onclick = function () {
    if (inputNickname && inputPersonal) {
      var nickname = inputNickname.value;
      var personal = inputPersonal.value;
      var username = document.getElementById('username-profile').value;
      ajaxUpdateProfile(username, nickname, personal);
    }
  }


  //ajax post update user infomation
  function ajaxUpdateProfile(username, nickname, personal) {
    var xmlHttp = GetXmlHttpObject();
    var sql = "update account set nickname = '" + nickname + "',personal = '" + personal + "' where username = '" + username + "'";
    var data = "type=update_account_info&sql=" + sql;
    if (xmlHttp == null) {
      toastr.error("Browser does not support HTTP Request");
      return;
    }
    var url = "./functions.php";
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          switch (xmlHttp.responseText) {
            case "update_account_success":
              if (inputFile.value != "") {
                var photoUrl = "../upload/" + username + "/" + username + "_avatar." + inputFile.files[0].type.split("/")[1];
                console.log(photoUrl);
                $('.photoUrl').attr("src", photoUrl);
              }
              $('.nickname').html(nickname);
              toastr.clear();
              toastr.success("个人信息更新成功！");
              disableUpdate();
              break;
            case "update_account_failed":
              toastr.error("更新失败，请重试！");
              break;
            case "file_type_error":
              toastr.error("上传文件格式错误，请上传jpg,gif或者png格式的图片");
              break;
            case "file_over_size":
              toastr.error("上传文件太大，请上传小于500kb的图片");
              break;
            case "file_folder_create_failed":
              toastr.error("服务器出了点问题，文件夹创建失败，请重试");
              break;
          }
        } else {
          toastr.error("请求出错，错误信息：" + xmlHttp.status);
        }
      }
    }
    if (window.FormData) {
      if (inputFile.value == "") {
        xmlHttp.open("POST", url);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp.send(data);
      } else {
        var formData = new FormData();
        formData.append('type', "update_account_all");
        formData.append('nickname', nickname);
        formData.append('personal', personal);
        formData.append('file', inputFile.files[0]);
        xmlHttp.open("POST", url);
        xmlHttp.send(formData);
        toastr.info("请求正在提交中......");
      }
    } else {
      toastr.error("您的浏览器不支持FormData方式上传头像文件，无法更新头像，请使用Chrome等现代浏览器");
      xmlHttp.open("POST", url);
      xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlHttp.send(data);
    }

  }

})();



function GetXmlHttpObject() {
  var objXMLHttp = null;
  if (window.XMLHttpRequest) {
    objXMLHttp = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return objXMLHttp;
}



/*safe setting*/

(function () {

  var data = new Array();
  $('#optgroup option').each(function () {
    if (this.getAttribute("selected") != null) {
      data.push(this.value);
    }
  });

  //change quick
  $('#optgroup').multiSelect({
    selectableOptgroup: true,
    afterSelect: function (values) {
      var index = data.indexOf(values[0]);
      if (index == -1) {
        data.push(values[0]);
      }
      console.log(data);
    },
    afterDeselect: function (values) {
      var index = data.indexOf(values[0]);
      if (index != -1) {
        data.splice(index, 1);
      }
      console.log(data);
    },
  });

  $('#changeQuick').click(function () {
    $.ajax({
      type: "GET",
      url: "./functions.php",
      dataType: 'json',
      data: {
        type: "change_quickCon",
        data: data.join(" ")
      },
      success: function (data) {
        if (data.state == "change_quickCon_success") {
          toastr.success("修改成功");
        } else if (data.state == "change_quickCon_failed") {
          toastr.error("修改失败，请重试");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("发生错误：");
      }
    });
  });
  //change email
  var modal1 = document.getElementById('myModal1Confirm');
  if (modal1) {
    modal1.onclick = function () {
      var inputValue = document.getElementById('myModal1Input').value;
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if (inputValue == "" || !reg.test(inputValue)) {
        toastr.info("请输入正确的邮箱地址");
      } else {
        var xmlHttp = GetXmlHttpObject();
        if (xmlHttp == null) {
          toastr.error("Browser does not support HTTP Request");
          return;
        }
        var url = "./functions.php?type=change_email&email=" + inputValue;
        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
              toastr.clear();
              switch (xmlHttp.responseText) {
                case "change_email_exit":
                  toastr.info("该邮箱已被注册，请换一个试试");
                  break;
                case "change_email_send":
                  toastr.success("新邮箱激活认证邮件已发送到原邮箱，请查收激活！");
                  $('#myModal1').modal('hide');
                  break;
                case "change_email_failed":
                  toastr.error("不可知的原因，激活邮件发送失败，请重试！");
                  break;
              }
            } else {
              toastr.error("发生错误：" + request.status);
            }
          }
        }
        xmlHttp.open("GET", url);
        xmlHttp.send(null);
        toastr.info("请求正在提交中......");
      }
    };
  }


  //send verifycode button animation
  $('.sendMessage').click(function () {
    if (this.value == "change_phoneNumber") {
      //modify phoneNumber
      var inputValue = document.getElementById('changePhoneInput').value;
      //check the new phone number
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(inputValue)) {
        toastr.info("手机格式不正确！");
        return;
      }
    } else if (this.value == "delete_device") {
      //delete device
    }
    this.disabled = "true";
    this.innerHTML = "<span class='Secondtext'>60</span>秒再发送";
    //here the action goes
    sendVerifycode(this.value, $(this).attr("data-phonenumber"));
    timeCount();
  });

  //Countdown 
  timeCount = function () {
    time = parseInt($('.Secondtext').text()) - 1;
    if (time == 0) {
      $('.sendMessage').get(0).disabled = false;
      $('.sendMessage').text('发送验证码');
    } else {
      $('.Secondtext').text(time);
      setTimeout("timeCount()", 1000);
    }
  }

  //send verifycode
  //type:the action
  //phoneNumber:the receiver
  function sendVerifycode(type, phoneNumber) {
    $.ajax({
      type: "GET",
      url: "../message/sendMessage.php",
      dataType: 'json',
      data: {
        type: type,
        phoneNumber: phoneNumber
      },
      success: function (data) {
        if (data.state == "sendVerifycode_success") {
          toastr.success("验证码已发送，请查收");
        } else if (data.state == "sendVerifycode_failed") {
          toastr.success("验证码发送出错，请重试获取");
          $('.Secondtext').text("1");
        }
      },
      error: function () {
        toastr.clear();
        toastr.error("验证码请求错误");
      }
    });
  }


  //change phonenumber
  $('#changePhoneConfirm').click(function () {
    var inputValue = document.getElementById('changePhoneInput').value;
    if (inputValue == "" || inputValue.length != 11) {
      toastr.info("请填写正确的手机号码！");
    } else {
      $.ajax({
        type: "GET",
        url: "./functions.php",
        dataType: 'json',
        data: {
          type: "change_phoneNumber",
          verifycode: $('.verifycodeInput').val(),
          phoneNumber: inputValue
        },
        success: function (data) {
          if (data.state == "change_phoneNumber_success") {
            $('#changePhoneModal').modal('hide');
            $('#phoneLabel > span').text(inputValue);
            toastr.success("手机绑定成功！");
          } else if (data.state == "change_phoneNumber_failed") {
            toastr.success("手机绑定失败，请重试！");
          } else if (data.state == "phoneNumber_exit") {
            toastr.info("手机号已存在");
          } else if (data.state == "verifycode_wrong") {
            toastr.info("验证码错误");
          }
        },
        error: function () {
          toastr.clear();
          toastr.error("发生错误：");
        }
      });
    }
  });


  //change password
  var modal3 = document.getElementById('myModal3Confirm');
  if (modal3) {
    modal3.onclick = function () {
      if ($('#newPassword').val() != $('#newPassword2').val()) {
        toastr.info("两次输入的新密码不一致");
        $('#newPassword2').val("");
      } else {
        var password = document.getElementById('password');
        $.ajax({
          type: "GET",
          url: "./functions.php",
          dataType: 'json',
          data: {
            type: "change_password",
            password: password.value,
            newPassword: $('#newPassword2').val()
          },
          success: function (data) {
            if (data.state == "change_password_success") {
              $('#myModal3').modal('hide');
              toastr.success("密码修改成功！");
            } else if (data.state == "change_password_failed") {
              toastr.error("密码修改失败，请重试！");
            } else if (data.state == "password_incorrect") {
              toastr.error("原密码输入错误");
              password.value = "";
            }
          },
          error: function () {
            toastr.clear();
            toastr.error("发生错误：");
          }
        });
      }

    }
  }

  //change address
  if ($('#address')) {
    $('#address').keypress(function () {
      $('#addressBtn').attr("disabled", false);
    });
    $('#address').change(function () {
      $('#addressBtn').attr("disabled", false);
    });

    $('#addressBtn').click(function () {
      if ($('#address').val() == "") {
        toastr.info("地址不能为空");
      } else {
        $.ajax({
          type: "GET",
          url: "./functions.php",
          dataType: 'json',
          data: {
            type: "change_address",
            address: $('#address').val()
          },
          success: function (data) {
            if (data.state == "change_address_success") {
              $('#myModal3').modal('hide');
              toastr.success("地址修改成功！");
            } else if (data.state == "change_address_failed") {
              toastr.error("地址修改失败，请重试！");
            }
          },
          error: function () {
            toastr.clear();
            toastr.error("发生错误：");
          }
        });
      }
    });
  }

})(jQuery);



/*logbook page*/


(function () {

  //check box animation
  $('#logTable > tr').click(function (event) {
    if ($('.label_check', this).hasClass('c_on')) {
      $('.label_check', this).removeClass('c_on').addClass('c_off');
    } else {
      $('.label_check', this).removeClass('c_off').addClass('c_on');
    }
  });

  //fix event propagation
  $('.label_check > input').click(function (event) {
    event.stopPropagation();
  });

  //check all and not check
  $('#checkall').click(function () {
    if ($('#checkall > i').hasClass('fa-check')) {
      $('#checkall > i').removeClass('fa-check').addClass('fa-remove');
      $('#checkall > span').html("全不选");
      $('.label_check > input').parent().removeClass('c_off').addClass('c_on');
    } else {
      $('#checkall > i').removeClass('fa-remove').addClass('fa-check');
      $('#checkall > span').html("全选");
      $('.label_check > input').parent().removeClass('c_on').addClass('c_off');
    }
  });

  //pass the logDate to the modal
  $('.btn.btn-danger.btn-sm').click(function () {
    $('#deletePasswordButton')[0].setAttribute("data-logdate", $(this).attr("data-logdate"));

  });

  //delete all log
  $('#deleteMore').click(function () {
    if ($('.label_check').hasClass('c_on')) {
      $(this).addClass('clicked');
      $('#deletePasswordConfirm').modal('show');
    } else {
      toastr.info("请勾选要删除的操作记录！");
    }
  });

  //modal confirm 
  $('#deletePasswordButton').click(function () {
    var password = $('#deletePasswordInput').val();
    if (password.length < 6) {
      toastr.info("密码位数不正确，至少6位");
    } else {
      if ($('#deleteMore').hasClass('clicked')) {
        console.log("批量删除");
        var logDateArray = new Array();
        $('#deleteMore').removeClass('clicked');
        $('.label_check.c_on').parent().next().each(function () {
          logDateArray.push(this.innerHTML);
        });
        $.ajax({
          type: "GET",
          url: "./functions.php",
          dataType: 'json',
          data: {
            type: "batch_delete_log",
            password: password,
            logDate: JSON.stringify(logDateArray)
          },
          success: function (data) {
            if (data.state == "password_wrong") {
              toastr.error("密码错误，请重新输入");
              $('#deletePasswordInput').val("");
            } else if (data.state == "batch_delete_log_success") {
              toastr.success("删除成功");
              $('#deletePasswordConfirm').modal('hide');
              //delete the logdate in view
              $('#logTable').children().each(function () {
                //save this object reference using that
                var that = this;
                $(this).children('td.td_check').each(function (that) {
                  return function () {
                    if ($(this).children('label').hasClass('c_on')) {
                      //set remove-flag for remove them
                      //setTimeout will lose this local context scope chain
                      $(that).addClass("remove-flag");
                      $(that).animate({ "opacity": "0" }, 1000);
                      setTimeout("$('.remove-flag').remove();", 1000);
                    }
                  }
                } (that));
              });
              //reset the password in modal input
              $('#deletePasswordInput').val("");
            } else if (data.state == "batch_delete_log_failed") {
              $('#deletePasswordConfirm').modal('hide');
              toastr.error("删除失败，请重试");
            }
          },
          error: function () {
            $('#deletePasswordConfirm').modal('hide');
            toastr.clear();
            toastr.error("发生错误：");
          }
        });
      } else {
        $.ajax({
          type: "GET",
          url: "./functions.php",
          dataType: 'json',
          data: {
            type: "delete_single_log",
            password: password,
            logDate: $(this).attr("data-logdate")
          },
          success: function (data) {
            if (data.state == "password_wrong") {
              toastr.error("密码错误，请重新输入");
              $('#deletePasswordInput').val("");
            } else if (data.state == "delete_single_log_success") {
              toastr.success("删除成功");
              $('#deletePasswordConfirm').modal('hide');
              //delete the logdate in view
              $('.btn.btn-danger.btn-sm').each(function () {
                if ($(this).attr("data-logdate") == $('#deletePasswordButton')[0].getAttribute("data-logdate")) {
                  window.one = $(this).parent().parent();
                  $(this).parent().parent().animate({ "opacity": "0" }, 1000);
                  setTimeout("$(window.one).remove();window.one = null;", 1000);
                  //reset the dateset logdate value of the dialog confirm button
                  $('#deletePasswordButton')[0].setAttribute("data-logdate", "");
                }
              });
              //reset the password in modal input
              $('#deletePasswordInput').val("");
            } else if (data.state == "delete_single_log_failed") {
              toastr.error("删除失败，请重试");
            }
          },
          error: function () {
            toastr.clear();
            toastr.error("发生错误：");
          }
        });
      }
    }
  });
})(jQuery);