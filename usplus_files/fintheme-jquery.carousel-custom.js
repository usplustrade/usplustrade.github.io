jQuery(document).ready(function($) {
	var isRTL = $('body').hasClass( 'rtl' ) ? true : false;

	$(".zozo-owl-carousel").each(function() {
		var $carousel = $(this);
		$carousel.owlCarousel({
			rtl				: isRTL,
			dots            : $carousel.data( "pagination" ),
			items           : $carousel.data( "items" ),
			slideBy         : $carousel.data( "slideby" ),
			center          : $carousel.data( "center" ),
			autoWidth       : $carousel.data( "autowidth" ),
			loop            : $carousel.data( "loop" ),
			margin          : $carousel.data( "margin" ),
			video			: $carousel.data( "video" ),
			lazyLoad		: $carousel.data( "lazyload" ),
			nav             : $carousel.data( "navigation" ),
			autoplay        : $carousel.data( "autoplay" ),
			autoplayTimeout : $carousel.data( "autoplay-timeout" ),
			navText         : [ '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>' ],
			responsiveClass : true,
			responsive      : {
				0: {
					items   : $carousel.data( "items-mobile-portrait" )
				},
				480: {
					items   : $carousel.data( "items-mobile-landscape" )
				},
				768: {
					items   : $carousel.data( "items-tablet" )
				},
				992: {
					items   : $carousel.data( "items" )
				}
			}
		});
	});
});