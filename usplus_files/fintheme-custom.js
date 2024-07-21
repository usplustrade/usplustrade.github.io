/**
 * Fintheme Mobile Menu jQuery
 */

( function( $ ) {
	"use strict";
	
	$( window ).resize(function() {
		if($( window ).width() >= 768 ){
			$( ".zmm-wrapper" ).animate( { left: "-100%" }, { duration: 500, specialEasing: { left: "easeInOutExpo" } } );
			$('body').removeClass('zmm-open');
		}
	});
	
	if( !$( ".zmm-wrapper .zmm-inner .main-nav" ).length ){
		$( ".main-menu-container" ).clone().appendTo( ".zmm-wrapper .zmm-inner" );
		
		$( ".zmm-wrapper .zmm-inner div.mega-dropdown-menu" ).each(function() {
			var mega_clone = $( this ).find('ul.mega-parent-ul').clone();
			var parent = $( this ).parents('li.menu-item');
			$( this ).remove();
			$(parent).append(mega_clone);
		});
	}
	
	if( $('.zmm-wrapper .main-right-nav').length ){
		$('.zmm-wrapper #main-right-menu').children().clone(true,true).appendTo( $('.zmm-wrapper .main-nav #main-menu') );
		$('.zmm-wrapper #main-right-nav-container').remove();
	}
	
	if( $( ".zmm-wrapper .zmm-inner li.mega-child-li.mega-widget" ).length )
		$( ".zmm-wrapper .zmm-inner li.mega-child-li.mega-widget" ).remove();
	
	$( ".zmm-wrapper .zmm-inner" ).find('ul.dropdown-menu, ul.mega-child-ul, ul.mega-parent-ul').addClass('sub-nav').removeClass('dropdown-menu mega-child-ul mega-parent-ul');
	$( ".zmm-wrapper .zmm-inner" ).find('.megamenu-title.hide').removeClass('hide');
	$( ".zmm-wrapper .zmm-inner" ).find('.dropdown, .dropdown-toggle, .dropdown-menu, .megamenu-title').removeClass('dropdown dropdown-toggle dropdown-menu megamenu-title');
	
	$(".zmm-wrapper .zmm-inner li.menu-item").removeClass (function (index, css) {
		return ( css.match (/\bcol-\S+/g) || [] ).join(' ');
	});
	$(".zmm-wrapper .zmm-inner li.menu-item").removeClass (function (index, css) {
		return ( css.match (/\bmega\S+/g) || [] ).join(' ');
	});
	
	$( ".zmm-wrapper .zmm-inner .zozo-megamenu-title" ).each(function() {
		$(this).replaceWith($('<a href="#">' + this.innerHTML + '</a>'));									
	});

	$( ".zmm-wrapper .zmm-inner" ).find('.menu-item-has-children').append( '<span class="zmm-dropdown-toggle flaticon flaticon-signs"></span>' );
	$( ".zmm-wrapper .zmm-inner" ).find('.sub-nav').slideToggle();

	/*Mobile Zmm Open*/
	$( ".mobile-menu-nav" ).on( "click", function() {
		$( ".zmm-wrapper .zmm-inner" ).fadeIn(0);
		$( ".zmm-wrapper" ).animate( { left: "0" }, { duration: 500, specialEasing: { left: "easeInOutExpo" } } );
		$('body').toggleClass('zmm-open');
		return false;
	});
	
	/*Mobile Zmm Close*/
	$( ".zmm-wrapper .zmm-close" ).on( "click", function() {
		$( ".zmm-wrapper" ).animate( { left: "-100%" }, { duration: 500, specialEasing: { left: "easeInOutExpo" } } );
		$('body').toggleClass('zmm-open');
		$('body').removeClass('mobile-menu-open');
		return false;
	});
	
	/*Mobile Zmm Close If Section*/
	$( ".zmm-wrapper .zmm-inner ul li a" ).on( "click", function() {
		$( ".zmm-wrapper" ).animate( { left: "-100%" }, { duration: 500, specialEasing: { left: "easeInOutExpo" } } );
		$('body').removeClass('zmm-open mobile-menu-open');
	});
	
	/*Zmm Dropdown Open*/
	$( ".zmm-wrapper .zmm-inner .zmm-dropdown-toggle" ).on( "click", function() {
		var parent = $( this ).parent('li').children('.sub-nav');
		$( this ).parent('li').children('.sub-nav').slideToggle();
		$( this ).toggleClass('flaticon-signs flaticon-arrows-9');
		if( $( parent ).find('.sub-nav').length ){
			$( parent ).find('.sub-nav').slideUp();
			$( parent ).find('.zmm-dropdown-toggle').removeClass('flaticon-arrows-9 flaticon-signs').addClass('flaticon-signs');	
		}
	});
	
	
	
} )( jQuery );
