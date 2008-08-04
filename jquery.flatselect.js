/*
 * --------------------------------------------------------------------
 * Flat Select jQuery Plugin - converting a select element to a flat divs elements
 * http://simonov.in.ua
 * Version: 0.1, 24.07.2008
 * Licensed under the MIT license:
 * Copyright (c) 2008 Alexander Simonov (simonov.in.ua)
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.
 */

jQuery.fn.flatSelect = function(url,options) {
		
	// name of our select element
	var flat_name = 'flatSelect' + $(this).attr('name');
	
	// default name of selected and non selected elements
	var defaults = {
		sclass: "flat_select",
		nsclass: "flat_no_select",
		action_fieldset: "",
		param_var: ""
	}
	
	var options = jQuery.extend(defaults,options);
		
	var uniqueID = $(this).attr('name');
		
	if ( $(this).find('.flatSelect_' + uniqueID).size() < 1 )
		$(this).addClass('flatSelect_'+uniqueID);
	
	var flatSelect = $('.flatSelect_'+uniqueID);
	
	//write flatSelect component
	if ( flatSelect.find('.' + flat_name).size() < 1 )
		flatSelect.append('<div class="' + flat_name + '"></div>');
	
	jQuery.getJSON(
		url,
		function(data) {
				jQuery.each(data,function(a,b) {
					flatSelect.find('select').append('<option value="'+ a +'">'+ b +'</option>');
					// fix bug with another version of jquery
					// all options set not selected
					flatSelect.find('select option').each(function() {
						this.selected = false;
					});
					flatSelect.find('.' + flat_name).append('<div id="'+ flat_name +'_div_' + a + '" class="' + options.nsclass + '">' + b +'</div>');
					$('div#' + flat_name + '_div_' + a).bind(
						'click',
						function () {
							if (options.action_fieldset != '') {
								$(options.action_fieldset+ ' select').empty();
								$(options.action_fieldset+ ' div').empty();
							}
							var j = [];
							var k = 0;
							flatSelect.find('select option').each(function() {
								$('#' + flat_name + '_div_' + this.value).removeClass(options.sclass);
								$('#' + flat_name + '_div_' + this.value).addClass(options.nsclass);
								if ( this.value == a ) {
									if (this.selected == true) {
										this.selected = false;
									}
									else {
										this.selected = true;
									}
								}
							});
							flatSelect.find('select option:selected').each(
								function() {
									j[k] = this.value;
									k++;
									$('#' + flat_name + '_div_' + this.value).removeClass(options.nsclass);
									$('#' + flat_name + '_div_' + this.value).addClass(options.sclass); 
								}
							);
							if (options.action_fieldset != '' && options.param_var != '') {
								if (j.length > 0)
									$(options.action_fieldset).flatSelect(url + '?' + options.param_var + '=' + j);
							}
						}
					);
				});
		}
	);
	
	// hide select
	flatSelect.find('select').css({'position': 'absolute', 'top': '-99999px', 'left': '-99999px'});
	if (options.action_fieldset != '')
		$(options.action_fieldset+ ' select').css({'position': 'absolute', 'top': '-99999px', 'left': '-99999px'});
	
}