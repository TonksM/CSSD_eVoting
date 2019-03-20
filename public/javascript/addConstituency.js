/** @module addConstituency Schema */

/**
 * Function to add a postcode checkbox to the ui to be assiociated to the constituency
 * @name addPostcode
 * @callback addPostcode
 */
function addPostcode(){
	var newPostcodeValue = document.getElementById("postcode").value;
	if(newPostcodeValue == null){
		
	}else{
		var quotedPostcode = '"' + newPostcodeValue + '"';
		document.getElementById("postcode").value = '';
		var newPostcode = "<input value='" + newPostcodeValue +"' onclick='removePostcode("+quotedPostcode+")' type='checkbox' name='postcodes' checked='true'/>";
		var newPostcodeLabel = document.createElement("label");
		newPostcodeLabel.innerText = newPostcodeValue;
		var divContainer = document.createElement("div");
		divContainer.id = newPostcodeValue;
		divContainer.class = "postcodeGroup";

		divContainer.append(newPostcodeLabel);
		divContainer.innerHTML += newPostcode;

		document.getElementById("postcodeGroup").append(divContainer);
	}
}
/**
 * Function to remove a postcode from the list of postcodes assiociated to the constituency
 * @name addPostcode
 * @callback addPostcode
 */
function removePostcode(postcode){
	var element = document.getElementById(postcode);
    element.parentNode.removeChild(element);
}