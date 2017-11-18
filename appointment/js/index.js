
//binding the event handler for the buttons
//load the appointment for the first time
function init(){
     $("#btnTest").on("click", clearTable);
     $("#btnNew").on("click", addNew);
     $("#btnAdd").on("click", addAppointment);
     $("#btnCancelNew").on("click", cancelNew);
     $("#btnSearch").on("click", search);
     $("#datepicker").datepicker({dateFormat: 'mm/dd/yy', minDate: 0});
     $('#timepicker').timepicker({'scrollDefault': '09:00' , 'timeFormat': 'h:i A'});
     getAppointments();
}

//addNew Button click event handler
function addNew(){
    //console.log("adding new appointment");
    resetForm();
    $("#btnNew").hide();
    $("#newForm").show();
}

//canel addNew click event handler
function cancelNew(){
        $("#btnNew").show();
        $("#newForm").hide();
        $('#errorMsg').html('');
}

//get appointments via Ajax
function getAppointments(keyWord){
    var data ;
    data = (keyWord == null) ? {"keyWords":''}: {"keyWords":keyWord} ;
    if (keyWord != null){
       clearTable();
    }
    data = JSON.stringify(data);

    $.ajax({
    	url : 'cgi/getAppointment.pl',
    	type : 'POST',
        data : data,
    	dataType : "json",
    	contentType : "application/json; charset=utf-8",
    	success	: function(response) {
            //console.log(response);
            $.each(response, function(index, data) {
                   console.log(data.appointmentDescription);
                  tr = $('<tr/>');
                  tr.append("<td>" + data.appDate + "</td>");
                  tr.append("<td>" + data.appTime + "</td>");
                  tr.append("<td>" + data.appDesc + "</td>");
                  $('#tabAppointment tbody').append(tr);
                });

          },
          error	: function(e) {
            console.log(e.message);
            $('#errorMsg').html(e.message);
          }
    	});
}

//Adding new appointment
function addAppointment(){
	//alert("add new appointment...");
	if ( !validData() )
	    return;

	var req = {};
	req.appDate =  $('#datepicker').val();
	req.appTime = $('#timepicker').val();
	req.appDesc =  $('#appDesc').val();

	req = JSON.stringify(req);
	$.ajax({
		  url		: "cgi/addAppointment.pl",
		  type		: 'POST',
		  data		: req,
		  dataType  : "json",
		  contentType   : "application/json; charset=utf-8",
		  success		: function(data) {
		        appendRecord();
		        resetForm();
		  },
		  error			: function(e) {
			    console.log(e.message);
		  }
	});
}
//search event handler
function search(){
	var keyWord = $("#searchBox").val();
	getAppointments(keyWord);
}

//remove the records in the table for refresh
function clearTable(){
   $('#tabAppointment tbody tr').remove();
}

//appennd to the table after addNew success
function appendRecord(){
      tr = $('<tr/>');
      tr.append("<td>" + $('#datepicker').val() + "</td>");
      tr.append("<td>" + $('#timepicker').val() + "</td>");
      tr.append("<td>" +  $('#appDesc').val() + "</td>");
      $('#tabAppointment tbody').append(tr);
}

//validate the input
function validData(){
    var msg = '';

    if (!isDate($('#datepicker').val()))
        msg += '<p>Invalid date format!';

    if (! isTime( $('#timepicker').val() ) )
        msg += '<p>Invalid time!';

    $('#errorMsg').html(msg);
    return (msg == '');
}

//valid the time input
function isTime(input){
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9]\s)(AM|PM)?$/.test(input);
    return (isValid) ;
}

//date validation
function isDate(date) {
    var objDate,
        mSeconds,
        day,
        month,
        year;
    if (date.length !== 10) {
        return false;
    }
    if (date.substring(2, 3) !== '/' || date.substring(5, 6) !== '/') {
        return false;
    }
    month = date.substring(0, 2) - 1;
    day = date.substring(3, 5) - 0;
    year = date.substring(6, 10) - 0;
    // test year range
    if (year < 1000 || year > 3000) {
        return false;
    }
    mSeconds = (new Date(year, month, day)).getTime();
    objDate = new Date();
    objDate.setTime(mSeconds);
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day) {
        return false;
    }
    return true;
}

//reset the form after submit
function resetForm(){
      $('#datepicker').val('');
      $('#timepicker').val('');
      $('#appDesc').val('');
}