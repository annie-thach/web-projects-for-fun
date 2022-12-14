var type1_tag = null;
var type1_strong_against_list = [];
var type1_weak_against_list = [];
var type1_no_effect_list = [];
var type1_weak_to_list = [];
var type1_resists_list = [];
var type1_immune_to_list = [];

var type2_tag = null;
var type2_strong_against_list = [];
var type2_weak_against_list = [];
var type2_no_effect_list = [];
var type2_weak_to_list = [];
var type2_resists_list = [];
var type2_immune_to_list = [];

var dual_type_weak_to_list_shared = [];
var dual_type_weak_to_list_diff = [];
var dual_type_resists_list_shared = [];
var dual_type_resists_list_diff = [];
var dual_type_immune_to_list = [];

var type1_select = document.getElementById("type1");
var type2_select = document.getElementById("type2");

/*
 * Populate type selection dropdowns with type options.
 */
var types_list = Object.keys(types_color_dict);
for(var idx = 0; idx < types_list.length; idx++) {
	// Create option.
	var opt = document.createElement("option");
	opt.value = types_list[idx]; 		// Set option value.
	opt.innerHTML = types_list[idx];	// Set option text.
	type1_select.appendChild(opt.cloneNode(true));	// Append a clone of option to type1 dropdown list.
	type2_select.appendChild(opt);		// Append option to type2 dropdown list.
}

update_display(); // Initial display.

/*
 * Helper to determine whether or not a string is "empty".
 */
function is_empty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

/*
 * For clearing out elements inside of an element.
 */
function clear_element(id) {
	document.getElementById(id).innerHTML = "";
}

/*
 * Create a type tag div.
 * Returns a type tag div element.
 */
function create_type_tag(type_value) {
	// Clean the string for the dictionary.
	var stripped_type_value = type_value.replace(/(\s+((0\.(25|5))|2|4)x)/, "");

	// Create and style the type tag.
	var type_div = document.createElement("div");
	type_div.className = "selected-type";						// Assign class.
	type_div.style.background = "#" + types_color_dict[stripped_type_value];	// Assign color.
	type_div.style.display = "inline-block";
	type_div.style.width = "84px";
	type_div.appendChild(document.createTextNode(type_value));	// Assign text.

	return type_div;
}

/*
 * Function to show/hide elements where necessary.
 */
function update_display() {
	// Output elements are hidden by default.
	document.getElementById("mono-output-area").style.display = "none";
	document.getElementById("dual-output-area").style.display = "none";

	// If something other than "None" is selected...
	if(type1_select.value !== "None" || type2_select.value !== "None") {
		// Show mono-type outputs.
		document.getElementById("mono-output-area").style.display = "block";
		
		// If type 1 isn't "None", show type 1.
		if(type1_select.value !== "None") {
			document.getElementById("type1-offense").style.display = "inline-block";
			document.getElementById("type1-defense").style.display = "inline-block";
		} else {
			document.getElementById("type1-offense").style.display = "none";
			document.getElementById("type1-defense").style.display = "none";
		}

		// If type 2 isn't "None", show type 2.
		if(type2_select.value !== "None" && type1_select.value !== type2_select.value) {
			document.getElementById("type2-offense").style.display = "inline-block";
			document.getElementById("type2-defense").style.display = "inline-block";
		} else {
			document.getElementById("type2-offense").style.display = "none";
			document.getElementById("type2-defense").style.display = "none";
		}

		// If type 1 and type 2 aren't "None", show dual-type outputs.
		if(type1_select.value !== "None" && type2_select.value !== "None" && type1_select.value !== type2_select.value) {
			document.getElementById("dual-output-area").style.display = "block";
		} else {
			document.getElementById("dual-output-area").style.display = "none";
		}
	}
}

/*
 * The driving event for type selection, to be called whenver a dropdown is interacted with.
 */
function select_type(event) {
	// Set dropdown color to color of type.
	event.style.background = "#" + types_color_dict[event.value];

	// Clear previous elements.
	for(var i = 1; i < 4; i++) {
		clear_element(event.id + "-offense" + i);
		clear_element(event.id + "-defense" + i);
		clear_element("dual-type-defense" + i);
	}

	// If type 1 or 2 is set to something other than "None" ...
	if(event.value !== "None") {
		var type_tags = update_mono_type(event);
		if(type1_select.value !== "None" && type2_select.value !== "None" && type1_select.value !== type2_select.value) {
			update_dual_type(type_tags);	
		}
	}

	update_display();	// Update display accordingly.
}

/*
 * Called to update information for individual types.
 * Returns selected type tags.
 */
function update_mono_type(event) {
	// Create & save mono-type tags for dual type calculations.
	var type_tag = create_type_tag(event.value);
	window[(event.id + "_tag")] = type_tag

	// Pointers of elements to update.
	var type_offense1 = document.getElementById(event.id + "-offense1");
	var type_offense2 = document.getElementById(event.id + "-offense2");
	var type_offense3 = document.getElementById(event.id + "-offense3");
	var type_defense1 = document.getElementById(event.id + "-defense1");
	var type_defense2 = document.getElementById(event.id + "-defense2");
	var type_defense3 = document.getElementById(event.id + "-defense3");

	// Create text elements.
	var type_offense1_text = document.createTextNode(" is super effective against (2x) ...\n");
	var type_offense2_text = document.createTextNode(" is resisted by (0.5x) ...\n");
	var type_offense3_text = document.createTextNode(" has no effect against (0x) ...\n");
	var type_defense1_text = document.createTextNode(" is weak to (2x) ...\n");
	var type_defense2_text = document.createTextNode(" resists (0.5x) ...\n");
	var type_defense3_text = document.createTextNode(" is immune to (0x) ...\n");

	// Calculate offensive typings.
	window[(event.id + "_strong_against_list")] = types_strong_against_dict[event.value].split(";");
	window[(event.id + "_weak_against_list")] = types_weak_against_dict[event.value].split(";");
	window[(event.id + "_no_effect_list")] = types_no_effect_dict[event.value].split(";");
	
	// Append supereffective types.
	type_offense1.appendChild(type_tag.cloneNode(true));
	type_offense1.appendChild(type_offense1_text);
	for(var idx = 0; idx < window[(event.id + "_strong_against_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_strong_against_list")][idx])) {
			type_offense1.appendChild(create_type_tag(window[(event.id + "_strong_against_list")][idx]));
		}
	}
	type_offense1.innerHTML += "<br>";

	// Affend resisted types.
	type_offense2.appendChild(type_tag.cloneNode(true));
	type_offense2.appendChild(type_offense2_text);
	type_offense2.innerHTML += "<br>";
	for(var idx = 0; idx < window[(event.id + "_weak_against_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_weak_against_list")][idx])) {
			type_offense2.appendChild(create_type_tag(window[(event.id + "_weak_against_list")][idx]));
		}
	}
	type_offense2.innerHTML += "<br>";

	// Append no effect types.
	type_offense3.appendChild(type_tag.cloneNode(true));
	type_offense3.appendChild(type_offense3_text);
	type_offense3.innerHTML += "<br>";
	for(var idx = 0; idx < window[(event.id + "_no_effect_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_no_effect_list")][idx])) {
			type_offense3.appendChild(create_type_tag(window[(event.id + "_no_effect_list")][idx]));
		}
	}
	type_offense3.innerHTML += "<br>";

	// Calculate defensive typings.
	window[(event.id + "_weak_to_list")] = types_weak_to_dict[event.value].split(";");
	window[(event.id + "_resists_list")] = types_resists_dict[event.value].split(";");
	window[(event.id + "_immune_to_list")] = types_immune_to_dict[event.value].split(";");

	// Append type weaknesses.
	type_defense1.appendChild(type_tag.cloneNode(true));
	type_defense1.appendChild(type_defense1_text);
	type_defense1.innerHTML += "<br>";
	for(var idx = 0; idx < window[(event.id + "_weak_to_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_weak_to_list")][idx])) {
			type_defense1.appendChild(create_type_tag(window[(event.id + "_weak_to_list")][idx]));
		}
	}
	type_defense1.innerHTML += "<br>";

	// Append type resistances.
	type_defense2.appendChild(type_tag.cloneNode(true));
	type_defense2.appendChild(type_defense2_text);
	type_defense2.innerHTML += "<br>";
	for(var idx = 0; idx < window[(event.id + "_resists_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_resists_list")][idx])) {
			type_defense2.appendChild(create_type_tag(window[(event.id + "_resists_list")][idx]));
		}
	}
	type_defense2.innerHTML += "<br>";

	// Append type immunities.
	type_defense3.appendChild(type_tag.cloneNode(true));
	type_defense3.appendChild(type_defense3_text);
	type_defense3.innerHTML += "<br>";
	for(var idx = 0; idx < window[(event.id + "_immune_to_list")].length; idx++) {
		if(!is_empty(window[(event.id + "_immune_to_list")][idx])) {
			type_defense3.appendChild(create_type_tag(window[(event.id + "_immune_to_list")][idx]));
		}
	}
	type_defense3.innerHTML += "<br>";

	return [type1_tag, type2_tag];
}

/*
 * Called to update information for dual types, if applicable.
 */
function update_dual_type(type_tags) {
	// Calculate defensive typings.
	// Filter out shared weaknesses into one list. These will be 2^2 = 4x weaknesses.
	dual_type_weak_to_list_shared = type1_weak_to_list.filter(type => type2_weak_to_list.includes(type)).sort();
	dual_type_weak_to_list_diff = type1_weak_to_list.filter(type => !type2_weak_to_list.includes(type)).concat(type2_weak_to_list.filter(type => !type1_weak_to_list.includes(type))).sort();
	
	// Filter out shared resistances into one list. These will be 0.5^2 = 0.25x weaknesses.
	dual_type_resists_list_shared = type1_resists_list.filter(type => type2_resists_list.includes(type));
	dual_type_resists_list_diff = type1_resists_list.filter(type => !type2_resists_list.includes(type)).concat(type2_resists_list.filter(type => !type1_resists_list.includes(type))).sort();

	// Immunities are shared.
	dual_type_immune_to_list = Array.from(new Set([...type1_immune_to_list, ...type2_immune_to_list])).sort();

	// Pointers of elements to update.
	var dual_type_defense1 = document.getElementById("dual-type-defense1");
	var dual_type_defense2 = document.getElementById("dual-type-defense2");
	var dual_type_defense3 = document.getElementById("dual-type-defense3");

	// Create text elements.
	var type_defense1_text = document.createTextNode(" is weak to ...\n");
	var type_defense2_text = document.createTextNode(" resists ...\n");
	var type_defense3_text = document.createTextNode(" is immune to ...\n");

	// Append dual-type weaknesses.
	dual_type_defense1.appendChild(type_tags[0].cloneNode(true));
	dual_type_defense1.appendChild(type_tags[1].cloneNode(true));
	dual_type_defense1.appendChild(type_defense1_text);
	dual_type_defense1.innerHTML += "<br>";
	for(var idx = 0; idx < dual_type_weak_to_list_shared.length; idx++) {
		if(!is_empty(dual_type_weak_to_list_shared[idx])) {
			dual_type_defense1.appendChild(create_type_tag(dual_type_weak_to_list_shared[idx] + " 4x"));
		}
	}
	for(var idx = 0; idx < dual_type_weak_to_list_diff.length; idx++) {
		if(!is_empty(dual_type_weak_to_list_diff[idx])) {
			dual_type_defense1.appendChild(create_type_tag(dual_type_weak_to_list_diff[idx] + " 2x"));
		}
	}
	dual_type_defense1.innerHTML += "<br>";

	// Append dual-type resistances.
	dual_type_defense2.appendChild(type_tags[0].cloneNode(true));
	dual_type_defense2.appendChild(type_tags[1].cloneNode(true));
	dual_type_defense2.appendChild(type_defense2_text);
	dual_type_defense2.innerHTML += "<br>";
	for(var idx = 0; idx < dual_type_resists_list_shared.length; idx++) {
		if(!is_empty(dual_type_resists_list_shared[idx])) {
			dual_type_defense2.appendChild(create_type_tag(dual_type_resists_list_shared[idx] + " 0.25x"));
		}
	}
	for(var idx = 0; idx < dual_type_resists_list_diff.length; idx++) {
		if(!is_empty(dual_type_resists_list_diff[idx])) {
			dual_type_defense2.appendChild(create_type_tag(dual_type_resists_list_diff[idx] + " 0.5x"));
		}
	}
	dual_type_defense2.innerHTML += "<br>";

	// Append dual-type immunities.
	dual_type_defense3.appendChild(type_tags[0]);
	dual_type_defense3.appendChild(type_tags[1]);
	dual_type_defense3.appendChild(type_defense3_text);
	dual_type_defense3.innerHTML += "<br>";

	for(var idx = 0; idx < dual_type_immune_to_list.length; idx++) {
		if(!is_empty(dual_type_immune_to_list[idx])) {
			dual_type_defense3.appendChild(create_type_tag(dual_type_immune_to_list[idx]));
		}
	}
	dual_type_defense3.innerHTML += "<br>";
}