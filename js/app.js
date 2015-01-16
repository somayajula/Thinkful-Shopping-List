/**
 * This was an assignment done for Thinkful Front-end Dev Bootcamp.
 */

$(document).ready(function () {
	/**
	 * Helper to toggle the state of Delete bought button
	 */
	function updateDeleteBoughtButton() {
		if ($("#items .selected").length == 0) {
			$("#delete-bought").attr("disabled", "disabled");
		} else {
			$("#delete-bought").removeAttr("disabled");
		}
	}

	// attach a click event handler for add button 
	$("#add-button").click(function () {
		var item = $("#add-input").val();
		addItem(item);
		// clear the value in text box because it's added
		$("#add-input").val("");
	});

	// This function adds a new item to the list if it's a valid one.
	function addItem(item) {
		// if the item is not empty or not spaces, then go forward.
		if (/\S/.test(item)) {
			// do not add duplicates
			if (isDuplicate(item)) {
				alert("'" + item + "' is already in the shopping list.");
				return;
			}

    		var str = "<li><span class='label'>" + item + "</span>"
    					+"<div class='actions'><span class='done'><button class='fa fa-check'><span class='element-invisible'>Done</span></button></span>"
    					+ "</span><span class='delete'><button class='fa fa-times'><span class='element-invisible'>Delete</span></button></span></div></li>";

    		// adding the new li tag to the end of the list - you are actually adding html string, but jQuery will create elements for you
			$("#items").append(str);
		}
	}

	/**
	 * if the item matches with any of the existing list items it returns true otherwise false
	 */
	function isDuplicate(item) {
		var list = $("#items li .label");

		for (var i = 0; i < list.length; i++) {
			if ($(list[i]).text() == item) {
				return true;
			}
 		}

 		// by default return false
 		return false;
	}

	// attach a keyup handler to detect if enter key is pressed
	$("#add-input").keyup(function (event) {
		if (event.keyCode == 13) {
			$("#add-button").click();
		}
	});

	// add a click handler for every "Done" button using parent's on click handler
	$("#items").on("click", ".done button", function () {
		// if the button is clicked when the label is "Done", then update the status
		if ($(this).find("span").text() == "Done") {
			// find the li that contains this button and add a class that indicates this element is selected
			$(this).closest("li").addClass("selected");
			$(this).find("span").text("Undone"); // update the button label
		} else { // when the button label is "Undone"
			$(this).find("span").text("Done");
			// remove the 'selected' class on the li
			$(this).closest("li").removeClass("selected");
		}

		// because if a item is marked done or undone, then we need to make sure the delete bought button is properly enabled/disabled
		updateDeleteBoughtButton();
	});

	// add a click handler to the delete bought button
	$("#delete-bought").click(function () {
		if ($("#items .selected").length > 0 && window.confirm("Are you sure you want to delete all bought items?")) {
			// select and remove all li elemenents with class "selected"
			$("#items .selected").remove();
			updateDeleteBoughtButton(); //or we can disable delete all button without calling this helper as well
		}
	});

	(function () {
		var undoTimer;    
	
		// add a click handler for delete a single list item, adding click handler on parent ul
		$("#items").on("click", ".delete button", function () {
			// clear previous timeout so that it doesn't empty the message
			if (undoTimer != undefined) {
				clearTimeout(undoTimer);
			}

			var item = $(this).closest("li").find(".label").text();
			$(this).closest("li").fadeOut(500, function() {
				$(this).remove();
				updateDeleteBoughtButton();
			});

			var undoMessage ="<p>'" + item + "' is deleted. <a href='#'>Undo</a></p></div>";
			$("#undo-message").html(undoMessage);
			
			$("#undo-message a").click(function () {
				addItem(item);
				$("#undo-message").html("");
			});
			
			// Delete the undo message after 8 seconds 
			undoTimer = setTimeout(function() {
				$("#undo-message").html("");
			}, 8000);
		});
	}());

	// when page is loaded we need to initialize the state of the button
	updateDeleteBoughtButton();
});