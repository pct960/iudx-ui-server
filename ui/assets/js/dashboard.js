/*----------------------------------------------
 For Pagination
-----------------------------------------------*/



var page_limit = 10;
var max_visible_pagesinpagination_bar = 10;
var __DATA;

/*----------------------------------------------
 Display & hide different sections 
-----------------------------------------------*/

$( document ).ready(function() {
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $(".section-create").hide(10);
    $("#confirmation_modal").hide(10);
    getPolicy();
	getGroups();
 });

 function displaySetPolicy(){
    $(".section-audit").hide(10);
    $(".section-manageGroups").hide(10);
    $("#searched_provider_items").hide(10);
    $(".section-create-form").hide(10);
     $("#confirmation_modal").hide(10);
     $(".section-setPolicyRules").show(10);
 }

 function displayManageGroups(){
    $(".section-audit").hide(10);
    $(".section-setPolicyRules").hide(10);
    $("#searched_provider_items").hide(10);
    $("#section-create-form").hide(10);
    $(".section-manageGroups").show(10);
    $("#confirmation_modal").hide(10);
}

function displayAuditSection(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $("#searched_provider_items").hide(10);
    $("#section-create-form").hide(10);
    $(".section-audit").show(10);
    $("#confirmation_modal").hide(10);
}

function displayProviderItems(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $(".section-create").hide(10);
    $("#searched_provider_items").show(10);
    $("#confirmation_modal").hide(10);
}

function displayCreateSection(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $("#searched_provider_items").hide(10);
    $(".section-create").show(10);
    $("#confirmation_modal").hide(10);
}

/*-------------------------------------
    section-homepage-catalogue
---------------------------------------*/

function json_to_htmlcard(json_obj){
    //  console.log(json_obj);
	if(json_obj['id'].split("/").length < 5){
		return ``
	}
	else{
		var openapi_url = "blah_blah"
		// var openapi_url = json_obj["accessInformation"]["value"][0]["accessObject"]["value"]
		// var openapi_url = json_obj["accessInformation"]["value"][0]["accessObject"]["value"]
		// //console.log(openapi_url)
        var is_public = (json_obj['secure']||[]).length === 0;
		var rat_btn_html=`<button class="btn btn-success" onclick="request_access_token('` + json_obj.id + `', '`+ json_obj["resourceServerGroup"]["value"] + `', '`+ json_obj["resourceId"]["value"] + `')" style="background-color:green">Request Access Token</button>`
		var s = json_obj["id"].split("/")
		return `
			<div id="card_`+ resource_id_to_html_id(json_obj['id']) +`" style="display:inline-block;" class="col-12 card-margin-top">
			<div class="card">
			  <h5 class="card-header card-header-color">
			  <span class="float-left" style="padding-right:7.5px;"><img src='`+
			  ((is_public) ? "../assets/img/icons/green_unlock.svg" : "../assets/img/icons/red_lock.svg")
			  +`' class='img-fluid secure_icon'></span>` + get_horizontal_spaces(3) + s.splice(2).join("/") + " <b>BY</b> " + s[0]  + `</h5>
			  <div class="card-body">
			    <h5 class="card-title">` + json_obj["itemDescription"] + `</h5>
			    <strong>Item-ID</strong>: `+json_obj['id']+`<br>
			    <strong>Onboarded-By</strong>: `+json_obj['onboardedBy']+`<br>
			    <strong>Access</strong>: `+ (is_public ? "Public": "Requires Authentication") +`<br>
			    <div class="btn-3-set" id="btn_`+resource_id_to_html_id(json_obj.id)+`">
			    <button class="btn btn-primary color-blue btn-3-set" onclick="show_details('`+ json_obj.id +`')">Details</button>
			    <!--button class="btn btn-success" onclick="display_swagger_ui('` + openapi_url + `')">API Details</button-->
			    `+ ((is_public)?"":rat_btn_html) +`
			    <a href="#" style="color:white"  class="data-modal" onclick="edit_data_from_list('`+json_obj['id']+`')"><button class="btn color-green btn-3-set">Edit</button></a>
			    <a style="color:white"  class="data-modal" onclick="show_confirmation_modal('`+json_obj['id']+`')"><button class="btn color-green btn-3-set">Delete</button></a>
			    </div>
			     <div id="token_section_`+resource_id_to_html_id(json_obj.id)+`" class="token_section"></div>
			  </div>
			  <div id="details_section_`+resource_id_to_html_id(json_obj.id)+`" class="details_section">
			  	<table class="table table-borderless table-dark">
				  <thead>
				  	<tr></tr>
				  </thead>
				  <tbody id="_tbody_`+resource_id_to_html_id(json_obj.id)+`">

				  </tbody>
				</table>
				<p id="extra_links_`+resource_id_to_html_id(json_obj.id)+`"></p>
			  </div>
			</div>
			</div>
		`	
	}
}


function get_horizontal_spaces(space_count){
	var horizontal_space_str=""
	for (var i = space_count.length - 1; i >= 0; i--) {
		horizontal_space_str+="&nbsp;"
	}
	return horizontal_space_str;
}

function resource_id_to_html_id(resource_id) {
    var replace_with = "_";
    return resource_id.replace(/\/|\.|\s|\(|\)|\<|\>|\{|\}|\,|\"|\'|\`|\*|\;|\+|\!|\#|\%|\^|\&|\=|\₹|\$|\@/g, replace_with)
}

function display_paginated_search_results(page_num){
	var global_data = get_global_data();
	$("#searched_provider_items").html("");
	var from = min(((page_num-1)*get_page_limit()),global_data.length);
	var to = min(((page_num)*get_page_limit()-1), global_data.length);
	for (var i=from;i < to; i++) {
		$("#searched_provider_items").append(json_to_htmlcard(global_data[i]));	
	}
	// //console.log("dislpaying item from:"+from+" to:"+to + " " + (global_data.length/get_page_limit() + ((global_data.length%get_page_limit())>0) ? 1 : 0));
}

function populate_pagination_section(){
    // init bootpag
    var data_length = get_global_data().length
    console.log(data_length)
    $('#page-selection').bootpag({
        total: (data_length/get_page_limit() + (((data_length%get_page_limit())>0) ? 1 : 0)),
        maxVisible: max_visible_pagesinpagination_bar,
        leaps: true,
		next: '>',
		prev: '<',
	    firstLastUse: true,
	    first: '<<',
	    last: '>>',
	    wrapClass: 'pagination',
	    activeClass: 'page-active',
	    disabledClass: 'disabled',
	    nextClass: 'next',
	    prevClass: 'prev',
	    lastClass: 'last',
	    firstClass: 'first'
    }).on("page", function(event, /* page number here */ num){
          display_paginated_search_results(num);
    });

    display_paginated_search_results(1);

}


function get_global_data(){
	return __DATA;
}

function set_data_globally(_data){
	__DATA = _data;
}

function set_page_limit(_page_limit){
	page_limit = _page_limit;
}

function get_page_limit(){
	return page_limit;
}

function min(val1, val2){
	return Math.min(val1, val2);
}

function toast_alert(__msg, __msg_type, __bg_color) {
    $.toast({
        heading: 'Success',
        text: `<b style="font-size: 20px !important;height: auto;
        text-align: center;
        width: 25%;
        ">` + __msg + `</b>`,
        position: 'mid-center',
        hideAfter: 2000,
        loader: false,  // Whether to show loader or not. True by default
        loaderBg: '#32c27d',
        bgColor: __bg_color,
        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: false, // Boolean value true or false
        icon: __msg_type// Type of toast icon  
    })
}

function create_confirmation_modal(_id){
    return `
    <section id="modal_`+ resource_id_to_html_id(_id) +`" class="confirmation_box">
    <div class="modal in" style="display: block;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Are you sure???</h4>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to delete (this)?</p>
                  <div class="row">
                      <div class="col-12-xs">
                          <button style="margin-left: 15px;margin-right: 10px;"id="confirm_btn" class="btn btn-success btn-md"  onclick="call_delete_api('` + _id + `')" value="yes" >Yes</button>
                          <button id="no_btn" class="btn btn-danger btn-md" value="no" onclick="remove_modal('`+ get_modal_id(_id) +`')">No</button>
                      </div>
                  </div>
                </div>
             
              </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
          </div><!-- /.modal -->
        </section>
    `
}

/*----------------------------------------------------
Edit & delete functions in catalogue section homepage
------------------------------------------------------*/

function remove_modal(modal_id){
    $(modal_id).remove()
}

function get_modal_id(_id){
    return "#modal_"+ resource_id_to_html_id(_id)
}

function call_delete_api(_id){
    var modal_id = get_modal_id(_id)
    // console.log(1)
    $.ajax({
        url: cat_conf['cat_base_URL'] + "/items/" +_id ,
        headers: {"Authorization" : "Basic cm9oaW5hOnJvaGluYXJiY2Nwcw=="},
        type: 'DELETE',
          complete: function(e, xhr, settings){
            remove_modal(modal_id)
            if(e.status === 204){
                $("#card_"+ resource_id_to_html_id(_id)).remove();
                $('#searched_provider_items').html($('searched_provider_items').html()) 
                toast_alert( 'Item deleted successfully', 'success', '#248c5a')
            }else if(e.status === 400){
                toast_alert(xhr, 'warning', '#1abc9c')
            }
        }
    });
    // console.log(2)
}

function show_confirmation_modal(_id) {
    // // $("#confirmation_modal").html("");
    var modal_id = get_modal_id(_id)
    $("body").append(create_confirmation_modal(_id))
    $(modal_id).show();
    
    $("#no_btn").click(function(){
        remove_modal(modal_id);
    });
}

// delete_data_from_list('`+json_obj['id']+`')

// function showConfirmationBox(_id) {
//     $("#confirmation_modal").html("");
//     $("#confirmation_modal").append(confirmation_box_to_html())
//     $("#confirmation_modal").show();
//     console.log($("#confirm_btn").val());
    
// }


