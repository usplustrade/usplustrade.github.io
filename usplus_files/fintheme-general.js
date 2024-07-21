/**
 * General.js
 *
 * contains the theme functionalities 
 */

jQuery.noConflict();
var get_scroll = 0;

(function($) {
	"use strict";
	
	var FINTHEME = window.FINTHEME || {};
	window.FINTHEME = FINTHEME;
	
	FINTHEME.CommonUtils = function() {
		$('a').on( "hover", function() {
			$(this).attr('data-title', $(this).attr('title'));
			$(this).removeAttr('title');
		}, function() {
			$(this).attr('title', $(this).attr('data-title'));
		});
	};
	
	FINTHEME.IsotopeLayout = function() {
		if( $('.zozo-isotope-layout').length > 0 ) {
			var isotopeContainersArray = [],
				typeGridArray = [],
				layoutGridArray = [],
				screenLgArray = [],
				screenMdArray = [],
				screenSmArray = [],
				transitionDuration = [],
				$filterItems = [],
				$filters = $('.zozo-isotope-filters'),
				$itemSelector = '.isotope-post',
				$items,
				itemMargin,
				correctionFactor = 0,
				firstLoad = true,
				isOriginLeft = $('body').hasClass('rtl') ? false : true;
				
			$('.zozo-isotope-layout').each(function() {
				var isoData = $(this).data(),
				$data_lg,
				$data_md,
				$data_sm;
				if (isoData.lg !== undefined) $data_lg = $(this).attr('data-lg');
				else $data_lg = '1000';
				if (isoData.md !== undefined) $data_md = $(this).attr('data-md');
				else $data_md = '600';
				if (isoData.sm !== undefined) $data_sm = $(this).attr('data-sm');
				else $data_sm = '480';
				screenLgArray.push($data_lg);
				screenMdArray.push($data_md);
				screenSmArray.push($data_sm);
				transitionDuration.push($('.post-inside-wrapper.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
				if (isoData.type == 'metro') typeGridArray.push(true);
				else typeGridArray.push(false);
				if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
				else layoutGridArray.push('masonry');
				isotopeContainersArray.push($(this));
			});
			
			var colWidth = function(index) {
					$(isotopeContainersArray[index]).width('');
					var isPx = $(isotopeContainersArray[index]).data('gutter'),
						widthAvailable = $(isotopeContainersArray[index]).width(),
						columnNum = 12,
						columnWidth = 0;
	
					//if (isPx) {
						//columnWidth = Math.ceil(widthAvailable / columnNum);
						//$(isotopeContainersArray[index]).width( columnNum * Math.ceil( columnWidth ) );
					//} else {
						columnWidth = ($('html.firefox').length) ? Math.floor(widthAvailable / columnNum) : widthAvailable / columnNum;
						//columnWidth = widthAvailable / columnNum;
					//}
					$items = $(isotopeContainersArray[index]).find('.isotope-post');
					itemMargin = parseInt($(isotopeContainersArray[index]).find('.post-inside-wrapper').css("margin-top"));
					for (var i = 0, len = $items.length; i < len; i++) {
						var $item = $($items[i]),
							multiplier_w = $item.attr('class').match(/post-iso-w(\d{0,2})/),
							multiplier_h = $item.attr('class').match(/post-iso-h(\d{0,2})/);
						
						if (widthAvailable >= screenMdArray[index] && widthAvailable < screenLgArray[index]) {
							if (multiplier_w[1] !== undefined) {
								switch (parseInt(multiplier_w[1])) {
									case (5):
									case (4):
									case (3):
										if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 6;
										break;
									case (2):
									case (1):
										if (typeGridArray[index]) multiplier_h[1] = (3 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 3;
										break;
									default:
										if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 12;
										break;
								}
							}
						} else if (widthAvailable >= screenSmArray[index] && widthAvailable < screenMdArray[index]) {
							if (multiplier_w[1] !== undefined) {
								switch (parseInt(multiplier_w[1])) {
									case (5):
									case (4):
									case (3):
									case (2):
									case (1):
										if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 6;
										break;
									default:
										if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 12;
										break;
								}
							}
						} else if (widthAvailable < screenSmArray[index]) {
							if (multiplier_w[1] !== undefined) {
								//if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
								multiplier_w[1] = 12;
								if (typeGridArray[index]) multiplier_h[1] = 12;
							}
						}
						
						var gutterSize = parseInt($(isotopeContainersArray[index]).data('gutter'));
						
						var width = multiplier_w ? (columnWidth * multiplier_w[1] ) : columnWidth,
							height = multiplier_h ? Math['ceil']((2 * Math.ceil(columnWidth / 2)) * multiplier_h[1]) - itemMargin : columnWidth;
						
						if (width >= widthAvailable) {
							$item.css({
								width: widthAvailable,
								paddingRight: gutterSize
							});
						} else {
							$item.css({
								width: width,
								paddingRight: gutterSize
							});
						}
												
						$(isotopeContainersArray[index]).css({
							'margin-top': '-' + gutterSize + 'px',
							'margin-right': '-' + gutterSize + 'px'
						});
					}
					return columnWidth;
				},
				init_isotope = function() {
					for (var i = 0, len = isotopeContainersArray.length; i < len; i++) {
						var isotopeSystem = $(isotopeContainersArray[i]).closest( $('.zozo-isotope-grid-system') ),
							isotopeId = isotopeSystem.attr('id'),
							$layoutMode = layoutGridArray[i];
							
						var gutterSize = parseInt($(isotopeContainersArray[i]).data('gutter'));
						
						$(isotopeContainersArray[i]).isotope({
							itemSelector: $itemSelector,
							layoutMode: $layoutMode,
							transitionDuration: transitionDuration[i],
							masonry: {
								columnWidth: colWidth(i)
							},
							vertical: {
								horizontalAlignment: 0.5,
							},
							sortBy: 'original-order',
							isOriginLeft: isOriginLeft
						}).on('layoutComplete', onLayout($(isotopeContainersArray[i]), 0));
						
						if ($(isotopeContainersArray[i]).hasClass('posts-isotope-infinite')) {
							$(isotopeContainersArray[i]).infinitescroll({
								navSelector: '#' + isotopeId + ' ul.pagination', // selector for the pagination container
								nextSelector: '#' + isotopeId + ' ul.pagination li a.next', // selector for the NEXT link (to page 2)
								itemSelector: '#' + isotopeId + ' .zozo-isotope-layout .isotope-post', // selector for all items you'll retrieve
								animate: false,
								behavior: 'local',
								debug: false,
								loading: {
									selector: '#' + isotopeId + '.zozo-blog-posts-wrapper .zozo-blog-pagination-wrapper',
									speed: 100,
									finished: undefined,
									msg: null,
									img: fintheme_js_vars.zozo_template_uri + "/images/ajax-loader.gif",
									msgText: "",
								},
								errorCallback: function() {
									var isotope_system = $(this).closest('.zozo-blog-posts-wrapper');
									$('ul.pagination', isotope_system).attr('style', 'display:none !important');
								}
							},
							// append the new items to isotope on the infinitescroll callback function.
							function(newElements, opts) {
								
								var $isotope = $(this),
									isotopeId = $isotope.closest('.zozo-blog-posts-wrapper').attr('id'),
									$infinite_button = $isotope.closest('.zozo-blog-posts-wrapper').find('ul.pagination'),
									$numPages = $("a.page-numbers:not('.current, .next, .prev'):last", $infinite_button).text();
								
								$infinite_button.hide();
								
								if ( $numPages != undefined && opts.state.currPage == $numPages ) {
									$infinite_button.hide();
									$(window).unbind('.infscr');
								}
								
								$isotope.isotope('reloadItems', onLayout($isotope, newElements.length));
								
							});
						}
					}
				},
				onLayout = function(isotopeObj, startIndex) {
					isotopeObj.css('opacity', 1);
					isotopeObj.closest('.zozo-isotope-grid-system').find('.zozo-pagination-wrapper').css('opacity', 1);
					setTimeout(function() {
						window.dispatchEvent(FINTHEME.boxEvent);
						if( typeof $.fn.mediaelementplayer !== 'undefined' && $.isFunction( $.fn.mediaelementplayer ) ) {
							$(isotopeObj).find('audio,video').each(function() {
								$(this).mediaelementplayer({
									pauseOtherPlayers: false,
								});
							});
						}
						
						$(isotopeObj).find("a[rel^='prettyPhoto'], a[data-rel^='prettyPhoto']").prettyPhoto({hook: 'data-rel', social_tools: false, deeplinking: false});
						
						if( $(isotopeObj).find('.owl-carousel').length ) {
							FINTHEME.owlCarousel( $(isotopeObj).find('.zozo-owl-wrapper') );
							window.dispatchEvent(FINTHEME.resizeEvent);
							setTimeout(function() {
								IsoBoxAnimation($('.isotope-post', isotopeObj), startIndex, true, isotopeObj);
							}, 200);
						} else {
							IsoBoxAnimation($('.isotope-post', isotopeObj), startIndex, true, isotopeObj);
						}
					}, 100);
				},
				IsoBoxAnimation = function(items, startIndex, sequential, container) {
					var $allItems = items.length - startIndex,
						showed = 0,
						index = 0;
					if (container.closest('.owl-item').length == 1) return false;
					$.each(items, function(index, val) {
						var elInner = $('> .post-inside-wrapper', val);
						if (val[0]) val = val[0];
						if (elInner.hasClass('animate_when_almost_visible') && !elInner.hasClass('force-anim')) {
							new Waypoint({
								element: val,
								handler: function() {
									var element = $('> .post-inside-wrapper', this.element),
										parent = $(this.element),
										currentIndex = parent.index();
									var delay = (!sequential) ? index : ((startIndex !== 0) ? currentIndex - $allItems : currentIndex),
										delayAttr = parseInt(element.attr('data-delay'));
									if (isNaN(delayAttr)) delayAttr = 100;
									delay -= showed;
									var objTimeout = setTimeout(function() {
										element.removeClass('zoom-reverse').addClass('start_animation');
										showed = parent.index();
									}, delay * delayAttr)
									parent.data('objTimeout', objTimeout);
									this.destroy();
								},
								offset: '100%'
							})
						} else {
							if (elInner.hasClass('force-anim')) {
								elInner.addClass('start_animation');
							} else {
								elInner.css('opacity', 1);
							}
						}
						index++;
					});
				};
			
			if( $('.zozo-isotope-pagination').length > 0 ) {
				var filterHeight = ($filters != undefined) ? $filters.outerHeight(true) - $('a', $filters).first().height() : 0;
				$('.zozo-isotope-grid-system').on('click', '.pagination a', function(evt) {
					evt.preventDefault();
					var container = $(this).closest('.zozo-isotope-grid-system');
					$('html, body').animate({
						scrollTop: container.offset().top - filterHeight
					}, 1000, 'easeInOutQuad');
					loadIsotope($(this));
					evt.preventDefault();
				});
			}
				
			$filters.on('click', 'a', function(evt) {
				var $filter = $(this),
					filterContainer = $filter.closest('.zozo-isotope-filters'),
					filterValue = $filter.attr('data-filter'),
					container = $filter.closest('.zozo-isotope-grid-system').find($('.zozo-isotope-layout')),
					transitionDuration = container.data().isotope.options.transitionDuration,
					delay = 300,
					filterItems = [];
					
				if (!$filter.hasClass('active')) {
					if (filterValue !== undefined) {
						$.each($('> .isotope-post > .post-inside-wrapper', container), function(index, val) {
							var parent = $(val).parent(),
								objTimeout = parent.data('objTimeout');
							if (objTimeout) {
								$(val).removeClass('zoom-reverse').removeClass('start_animation')
								clearTimeout(objTimeout);
							}
							if (transitionDuration == 0) {
								if ($(val).hasClass('animate_when_almost_visible')) {
									$(val).addClass('zoom-reverse').removeClass('start_animation');
								} else {
									$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
								}
							}
						});
						setTimeout(function() {
							container.isotope({
								filter: function() {
									var block = $(this),
									filterable = (filterValue == '*') || block.hasClass(filterValue);
									if (filterable) {
										filterItems.push(block);
									}
									return filterable;
								}
							});
							$('.post-inside-wrapper.zoom-reverse', container).removeClass('zoom-reverse');
						}, delay);
						/** once filtered - start **/
						if (transitionDuration == 0) {
							container.isotope('once', 'arrangeComplete', function() {
								setTimeout(function() {
									IsoBoxAnimation(filterItems, 0, false, container);
								}, 100);
							});
						}
						/** once filtered - end **/
					} else {
						$.each($('> .isotope-post > .post-inside-wrapper', container), function(index, val) {
							var parent = $(val).parent(),
								objTimeout = parent.data('objTimeout');
							if (objTimeout) {
								$(val).removeClass('zoom-reverse').removeClass('start_animation')
								clearTimeout(objTimeout);
							}
							if (transitionDuration == 0) {
								if ($(val).hasClass('animate_when_almost_visible')) {
									$(val).addClass('zoom-reverse').removeClass('start_animation');
								} else {
									$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
								}
							}
						});
						container.parent().addClass('isotope-loading');
						loadIsotope($filter);
					}
				}
				evt.preventDefault();
			});
						
			var loadIsotope = function($href) {
				var href = ($href.is("a") ? $href.attr('href') : location),
					isotopeSystem = ($href.is("a") ? $href.closest($('.zozo-isotope-grid-system')) : $href),
					isotopeWrapper = isotopeSystem.find($('.zozo-isotope-wrapper')),
					isotopeFooter = isotopeSystem.find($('.zozo-pagination-wrapper')),
					isotopeContainer = isotopeSystem.find($('.zozo-isotope-layout')),
					isotopeId = isotopeSystem.attr('id');
					
				if ($href.is("a")) history.pushState({
					myIsotope: true
				}, document.title, href);
				$.ajax({
					url: href
				}).done(function(data) {
					var $resultItems = $(data).find('#' + isotopeId + ' .zozo-isotope-layout').html(),
						$resultPagination = $(data).find('#' + isotopeId + ' .pagination');
					isotopeWrapper.addClass('isotope-reloaded');
					setTimeout(function() {
						isotopeWrapper.removeClass('isotope-loading');
						isotopeWrapper.removeClass('isotope-reloaded');
					}, 500);
					$.each($('> .isotope-post > .post-inside-wrapper', isotopeContainer), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearTimeout(objTimeout);
						}
						if ($(val).hasClass('animate_when_almost_visible')) {
							$(val).addClass('zoom-reverse').removeClass('start_animation');
						} else {
							$(val).addClass('animate_when_almost_visible zoom-reverse zoom-in force-anim');
						}
					});
					setTimeout(function() {
						if (isotopeContainer.data('isotope')) {
							isotopeContainer.html($resultItems).isotope('reloadItems', onLayout(isotopeContainer, 0));
						}
					}, 300);
					$('.pagination', isotopeFooter).remove();
					isotopeFooter.append($resultPagination);
				});
			};
			
			$filters.each(function(i, buttonGroup) {
				var $buttonGroup = $(buttonGroup);
				$buttonGroup.on('click', 'a', function() {
					$buttonGroup.find('.active').removeClass('active');
					$(this).addClass('active');
				});
			});
			
			window.addEventListener('boxResized', function(e) {
				$.each($('.zozo-isotope-layout'), function(index, val) {
					var $layoutMode = ($(this).data('layout'));
					if ($layoutMode === undefined) $layoutMode = 'masonry';
					
					if ($(this).data('isotope')) {
						$(this).isotope({
							itemSelector: $itemSelector,
							layoutMode: $layoutMode,
							transitionDuration: transitionDuration[index],
							masonry: {
								columnWidth: colWidth(index)	
							},
							vertical: {
								horizontalAlignment: 0.5,
							},
							sortBy: 'original-order',
							isOriginLeft: isOriginLeft
						});
						$(this).isotope('unbindResize');
					}
					$(this).find('.mejs-video,.mejs-audio').each(function() {
						$(this).trigger('resize');
					});
				});
			}, false);
			init_isotope();
		};
	};
	
	FINTHEME.owlCarousel = function(container) {
		var $owlSelector = $('.owl-carousel-container > [class*="owl-carousel"]', container),
			values = {},
			tempTimeStamp,
			currentIndex,
			$owlInsideEqual = [];
			
		$owlSelector.each(function() {
			var itemID = $(this).attr('id'),
				$elSelector = $(('#' + itemID).toString());
				
			values['id'] = itemID;
			values['items'] = 1;
			values['columns'] = 3;
			values['slideby'] = 1;
			values['fade'] = false;
			values['nav'] = false;
			values['navmobile'] = false;
			values['navskin'] = 'light';
			values['navspeed'] = 400;
			values['dots'] = false;
			values['dotsmobile'] = false;
			values['loop'] = false;
			values['autoplay'] = false;
			values['timeout'] = 3000;
			values['autoheight'] = false;
			values['margin'] = 0;
			values['lg'] = 1;
			values['md'] = 1;
			values['sm'] = 1;
			values['xs'] = 1;
			values['lazyload'] = false;
			$.each($(this).data(), function(i, v) {
				values[i] = v;
			});
				
			values['navskin'] = ' style-'+values['navskin'];
			
			/** Initialized */
			$elSelector.on('initialized.owl.carousel', function(event) {
	
				var thiis = $(event.currentTarget),
					// get the time from the data method
					time = thiis.data("timer-id");
				if (time) {
					clearTimeout(time);
				}
				thiis.addClass('showControls');
				
				var new_time = setTimeout(function() {
					thiis.closest('.owl-carousel-container').removeClass('owl-carousel-loading');
				}, 350);
				// save the new time
				thiis.data("timer-id", new_time);
	
				var scrolltop = $(document).scrollTop();
	
				if (!FINTHEME.isMobile) {
					/** fix autoplay when visible **/
					if ($(event.currentTarget).data('autoplay')) {
						$(event.currentTarget).trigger('stop.autoplay.owl');
					}
					var carouselInView = new Waypoint.Inview({
						element: $(event.currentTarget)[0],
						enter: function(direction) {
							var el = $(this.element);
							if (el.data('autoplay')) {
								setTimeout(function() {
									el.trigger('play.owl.autoplay',[100]);
								}, 500);
							}
						},
						exited: function() {
							if ($(this.element).data('autoplay')) {
								$(this.element).trigger('stop.owl.autoplay');
							}
						}
					});
				}
		
				var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
				currentIndex = $(currentItem).attr('data-index');
				
				var el = $(event.currentTarget);
				el.closest('.zozo-owl-slider').addClass('slider-loaded');
					
				setTimeout(function() {
					if ($(event.currentTarget).closest('.zozo-owl-slider').length) {
						if ($(event.currentTarget).data('autoplay')) pauseOnHover(event.currentTarget);
					}
				}, 500);
				
				owlResetVideoSize( $(this) );
			});
	
			/** Resizing */
			$elSelector.on('resized.owl.carousel', function(event) {
				if ($(this).closest('.nested-carousel').length) {
					setTimeout(function() {
						window.dispatchEvent(FINTHEME.boxEvent);
					}, 200);
				}
				owlResetVideoSize( $(this) );
			});
	
			/** Change */
			$elSelector.on('change.owl.carousel', function(event) {
			});
	
			/** Changed */
			$elSelector.on('changed.owl.carousel', function(event) {
				if (tempTimeStamp != event.timeStamp) {
					var scrolltop = $(document).scrollTop();
					var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[(event.item.index != null) ? event.item.index : 0];
				}
				tempTimeStamp = event.timeStamp;
			});
	
			$elSelector.on('translate.owl.carousel', function(event) {
				$(event.currentTarget).addClass('owl-translating');
			});
	
			/** Translated */
			$elSelector.on('translated.owl.carousel', function(event) {
	
				var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
					currentIndex = $(currentItem).attr('data-index');

			});
	
			/** Init carousel */
			$elSelector.owlCarousel({
				items: values['items'],
				slideBy: values['slideby'],
				animateOut: (values['fade'] == true) ? 'fadeOut' : null,
				nav: values['nav'],
				dots: values['dots'],
				loop: values['loop'],
				margin: values['margin'],
				video: true,
				lazyLoad: values['lazyload'],
				autoWidth: false,
				autoplay: values['autoplay'],
				autoplayTimeout: values['timeout'],
				autoplaySpeed: values['navspeed'],
				autoplayHoverPause: $(this).closest('.zozo-owl-slider').length ? false : true,
				autoHeight: ($(this).hasClass('owl-height-equal') || $(this).hasClass('owl-height-auto')) ? true : values['autoheight'],
				rtl: $('body').hasClass('rtl') ? true : false,
				fluidSpeed: true,
				navSpeed: values['navspeed'],
				navClass: [ 'owl-prev'+values['navskin'], 'owl-next'+values['navskin'] ],
				navText: ['<div class="owl-nav-container"><i class="fa fa-angle-left"></i></div>', '<div class="owl-nav-container"><i class="fa fa-angle-right"></i></div>'],
				navContainer: values['nav'] ? $elSelector : false,
				responsiveClass: true,
				responsive: {
					0: {
						items: values['xs'],
						nav: values['navmobile'],
						dots: values['dotsmobile']
					},
					480: {
						items: values['sm'],
						nav: values['navmobile'],
						dots: values['dotsmobile']
					},
					768: {
						items: values['md'],
						nav: values['navmobile'],
						dots: values['dotsmobile']
					},
					992: {
						items: values['items']
					}
				}
			});
			
			window.dispatchEvent(FINTHEME.resizeEvent);
		});
				
		function pauseOnHover(slider) {
			$('.owl-dots, .owl-prev, .owl-next', slider).on({
				mouseenter: function () {
					$(slider).addClass('owl-mouseenter');
					$(slider).trigger('stop.owl.autoplay');
				},
				mouseleave: function () {
					$(slider).removeClass('owl-mouseenter')
					$(slider).trigger('play.owl.autoplay');
				}
			});
		}
		
		function owlResetVideoSize( owlId, video_width ){
			//better use jquery selectors: owl.items() and $(owl.items()) give problems, don't know why
			var items = owlId.find('.owl-item:not([data-video])');
			var videos = owlId.find('.owl-item .owl-video-wrapper');
			var v_height = 0;
			
			//user-defined width ELSE, width from inline css (when owl.autoWidth == false), 
			//ELSE, computed innerwidth of the first element.
			var v_width = (video_width) ? video_width : ((items.css('width') != 'auto') ? items.css('width') : items.innerWidth());
			
			items.each(function(){
				var h = $(this).innerHeight();
				if(h > v_height) v_height = h;
			});
			
			//set both width and height
			videos.css({ 'height':v_height, 'width':v_width });
		}
	};
	
	FINTHEME.VcAnimations = function() {
		if( ! window.waypoint_animation ) {
			window.waypoint_animation = function() {
				$.each( $('.wpb_animate_when_almost_visible:not(.wpb_start_animation)'), function(index, val) {
					var run = true;
					if (run) {
						new Waypoint({
							element: val,
							handler: function() {
								var element = $(this.element),
									index = element.index(),
									delayAttr = element.attr('data-delay');
								if (delayAttr == undefined) delayAttr = 0;
								setTimeout(function() {
									element.addClass('wpb_start_animation');
								}, delayAttr);
								this.destroy();
							},
							offset: '90%'
						});
					}
				});
			}
		}
		setTimeout(function() {
			window.waypoint_animation();
		}, 100);
	};
	
	FINTHEME.VcProgressBar = function() {
		window.vc_progressbar_animation = function() {
			$.each( $('.vc_progress_bar .vc_single_bar'), function(index, val) {
				var run = true;
				if (run) {
					new Waypoint({
						element: val,
						handler: function() {
							var element = $(this.element),
								index = element.index(),
								bar = element.find(".vc_bar"),
                    			val = bar.data("percentage-value");
								
							setTimeout(function() {
								bar.css({
									width: val + "%"
								});
							}, 200 * index);
							this.destroy();
						},
						offset: '85%'
					});
				}
			});
		}
		
		window.vc_progressbar_animation();
	};
	
	FINTHEME.VcCounter = function() {
		window.vc_counter_animation = function() {
			$.each( $('.zozo-counter-wrapper .zozo-count-number'), function(index, val) {
				var run = true;
				if (run) {
					new Waypoint({
						element: val,
						handler: function() {
							var element = $(this.element),
								index = element.index(),
								counter = element.find(".counter"),
                    			val = element.data("count");
								
							setTimeout(function() {
								counter.countTo({
									from: 1,
									to: val,
									speed: 4000,
									refreshInterval: 50,
								});
							}, 200 * index);
							this.destroy();
						},
						offset: '85%'
					});
				}
			});
		}
		
		window.vc_counter_animation();
	};
	
	FINTHEME.blogInfiniteScroll = function() {
		if( $('.zozo-posts-container.posts-infinite').length > 0 ) {
			$('.zozo-posts-container.posts-infinite').each(function() {
				var $infinite_container = $(this),
				mainWrapper = $( $infinite_container ).parent( $('.zozo-blog-posts-wrapper') ),
				mainWrapperID = mainWrapper.attr('id');							
				
				$( $infinite_container ).infinitescroll({
					navSelector: '#' + mainWrapperID + ' ul.pagination', // selector for the pagination container
					nextSelector: '#' + mainWrapperID + ' ul.pagination li a.next', // selector for the NEXT link (to page 2)
					itemSelector: '#' + mainWrapperID + ' .zozo-posts-container .post', // selector for all items you'll retrieve
					animate: false,
					behavior: 'local',
					debug: false,
					loading: {
						selector: '#' + mainWrapperID + '.zozo-blog-posts-wrapper .zozo-blog-pagination-wrapper',
						speed: 100,
						finished: undefined,
						msg: null,
						img: fintheme_js_vars.zozo_template_uri + "/images/ajax-loader.gif",
						msgText: "",
					},
					errorCallback: function() {
						var blogWrapper = $(this).closest('.zozo-blog-posts-wrapper');
						$('.ul.pagination', blogWrapper).attr('style', 'display:none !important');
					}
				},
				// append the new items to isotope on the infinitescroll callback function.
				function(newElements, opts) {
					
					var $newItems = $(this),
						newItemsId = $newItems.closest('.zozo-blog-posts-wrapper').attr('id'),
						$infinite_button = $newItems.closest('.zozo-blog-posts-wrapper').find('ul.pagination'),
						$numPages = $("a.page-numbers:not('.current, .next, .prev'):last", $infinite_button).text();
					
					$infinite_button.hide();
					
					if ( $numPages != undefined && opts.state.currPage == $numPages ) {
						$infinite_button.hide();
						$(window).unbind('.infscr');
					}
					
					$newItems.css('opacity', 1);
					setTimeout(function() {
						if( typeof $.fn.mediaelementplayer !== 'undefined' && $.isFunction( $.fn.mediaelementplayer ) ) {
							$($newItems).find('audio,video').each(function() {
								$(this).mediaelementplayer({
									pauseOtherPlayers: false,
								});
							});
						}
						
						$($newItems).find("a[rel^='prettyPhoto'], a[data-rel^='prettyPhoto']").prettyPhoto({hook: 'data-rel', social_tools: false, deeplinking: false});
						
						if( $($newItems).find('.owl-carousel').length ) {
							FINTHEME.owlCarousel( $($newItems).find('.zozo-owl-wrapper') );
						}
					}, 100);
					
				});
			});
		}
	};
	
	FINTHEME.PortfolioSmartMenuNew = function() {
		window.PortfolioFilterSmartmenuNew = function() {
			$.each( $('.zozo-isotope-filters .zozo-smartmenu'), function() {
				var filter_state = 0;
				
				$(this).find('a > .sub-arrow').on('click', function(evt) {
					evt.preventDefault();
					var $filter_menu = $(this).parent().parent().parent('.smart-sub-menu').find('li').filter(':not(.first-element)');
					
					if( filter_state === 0 ) {
						$filter_menu.slideDown( 240, 'easeOutQuad' );
						$(this).addClass( 'highlighted' );
						filter_state = 1;
					} else if( filter_state == 1 ) {
						$filter_menu.slideUp( 240,'easeOutQuad' );
						$(this).removeClass( 'highlighted' );
						filter_state = 0;
					}
					return false;
				});
			});
		}
		
		window.PortfolioFilterSmartmenuNew();
	};
	
	FINTHEME.VcCustomCss = function() {
		window.VcCustomCssInit = function() {
			var css = '';
			$.each( $('.zozo-vc-custom-css'), function() {
				 css += $(this).data( 'css' );
				 $(this).remove();
			});
			if( css !== null ) {
				$('head').append( '<style type="text/css" data-type="zozo_vc_custom_css">' + css + '</style>');
			}
		}
		
		window.VcCustomCssInit();
	};
	
	FINTHEME.VcModalBox = function() {
		window.VcModalBoxInit = function() {
			
			var triggerBtn = $( 'zozo-modal-overlay-show' ),
			overlay = $( 'div.zozo-vc-modal-overlay' ),
			closeBtn = overlay.find( 'div.zozo-vc-modal-overlay-close' ),
			transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
			transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
			support = { transitions : Modernizr.csstransitions };
			
			function toggleOverlay(id) {
				var zozo_overlay = 'div.zozo-vc-modal-overlay.' + id;
				var joverlay = document.querySelector( zozo_overlay );
				var overlay = $(zozo_overlay);
				/* firefox transition issue fix of overflow hidden */
				
				if( overlay.hasClass('zozo-modal-open') ) {
					overlay.removeClass('zozo-modal-open');
					overlay.addClass('zozo-modal-close');
					
					var onEndTransitionFn = function( ev ) {
						if( support.transitions ) {
							if( ev.propertyName !== 'visibility' ) return;
							this.removeEventListener( transEndEventName, onEndTransitionFn );
						}
						overlay.removeClass('zozo-modal-close');
					};
					
					if( support.transitions ) {
						joverlay.addEventListener( transEndEventName, onEndTransitionFn );
						overlay.removeClass('zozo-modal-close');
						if(window_height < modal_height) //remove overflow hidden
							$('html').css({'overflow':'auto'});
					}
					else {
						onEndTransitionFn();
					}
				}
				else if( ! overlay.hasClass('zozo-modal-close') ) {
					overlay.addClass('zozo-modal-open');
				}
				var modal_height = overlay.find('.zozo_vc_modal').outerHeight(); //modal height
				var window_height = $(window).outerHeight(); //window height
				if(window_height < modal_height) //if window height is less than modal height
					$('html').css({'overflow':'hidden'}); //add overflow hidden to html
			}
			
			function contentCheck(id){
				var ch = $('.'+id).find('.zozo_vc_modal-content').height();
				var wh = $(window).height();
				if(ch > wh){
					$('.'+id).addClass('zozo_modal-auto-top');
				}
				else{
					$('.'+id).removeClass('zozo_modal-auto-top');
				}
			}
			
			function hideForever(id){
				var content = $('.'+id).find('.zozo_vc_modal-content');
				
				if( content.find( '.zozo-vc-modal-hide input.zozo-modal-checkbox' ).is(':checked') ) {
					$.ajax({
						url: fintheme_js_vars.zozo_ajax_url,
						type: "POST",
						data: {
							action: 'modal_hide_forever',
							id: id,
							value: '1'
						},
						success: function(data) {},
						error: function() {}
					});
				}
			}
	
			$.each( $('.zozo-vc-modal-overlay'), function() {
				 $(this).appendTo(document.body);
				 $(this).show();
			});
			
			$(document).on('click', '.zozo-modal-overlay-show', function(event){
				event.stopPropagation();
				event.preventDefault();
				
				var modal_id = $(this).data('modal-id');
				
				setTimeout(function() {
					$('body').removeClass('zozo-modal-body-closing');
					$('body').addClass('zozo-modal-body-open');
					toggleOverlay(modal_id);
					contentCheck(modal_id);
				}, 500);
			});
			
			$(document).on('click', '.zozo-vc-modal-overlay .zozo-vc-modal-overlay-close', function(event){
				event.stopPropagation();
				
				var id = $(this).parents('.zozo-vc-modal-overlay').data('class');
				toggleOverlay(id);
				hideForever(id);
				if( $('body').hasClass('zozo-modal-body-open')) {
					$('body').removeClass('zozo-modal-body-open');
					$('body').addClass('zozo-modal-body-closing');
				}
				$('html').css({'overflow':'auto'});
				
				return false;
			});
			
			$(document).on('click', '.zozo-vc-modal-overlay .zozo_vc_modal', function(event){
				event.stopPropagation();
			});
	
			$(document).on('click', '.zozo-vc-modal-overlay', function(event){
				event.stopPropagation();
				event.preventDefault();
				
				$(this).find('.zozo-vc-modal-overlay-close').trigger('click');
				$('html').css({'overflow':'auto'});
			});
		}
		
		window.VcModalBoxInit();
	};
	
	FINTHEME.VcModalBoxOnload = function() {
		window.VcModalBoxOnloadInit = function() {
			var onload_modal_array = new Array();
			$('.zozo-modal-onload').each(function(index){
				onload_modal_array.push($(this));
				setTimeout(function() {
					onload_modal_array[index].trigger('click');
				}, parseInt($(this).data('onload-delay'))*1000);
			});
		}
		
		window.VcModalBoxOnloadInit();
	};
	
	FINTHEME.stickyElements = function() {
		setTimeout(function() {
			if( $('.sticky-sidebar').length ) {
				var sideOffset = parseInt($('.sticky-sidebar').closest('.sticky-sidebar-parent').parent('.site-content').css("padding-top").replace("px", ""));
				
				if( $('#wpadminbar').length > 0 ) {
					sideOffset += 32;
				}
					
				if( $('body').hasClass('header-is-sticky') ) {
					
					if( $(".header-section").hasClass( 'type-header-11' ) ) {
						var sticky_height = fintheme_js_vars.zozo_sticky_height_alt;
					} else {
						var sticky_height = fintheme_js_vars.zozo_sticky_height;
					}
					
					var scroll_offset = sticky_height.match(/\d+/);
			
					if( scroll_offset !== null && scroll_offset != 0 ) {
						sideOffset += scroll_offset - 2;
					}
				}
			
				if( $(window).width() > 991 ) {
					$(".sticky-sidebar").stick_in_parent({
						sticky_class: 'is_stucked',
						offset_top: sideOffset,
						bottoming: true,
						inner_scrolling: false
					}).on("sticky_kit:stick", function(e) {
						var col = $(this).data('col');
						var width = ( 100 / ( 12 / col ) ).toFixed(4);
						$(this).parent('div').css({'width': width + '%', 'position':'static'});
					});
				}
				$(window).on('resize', function(event) {
					if( $(window).width() > 991 ) {
						$(".sticky-sidebar").stick_in_parent({
							sticky_class: 'is_stucked',
							offset_top: sideOffset,
							bottoming: true,
							inner_scrolling: false
						}).on("sticky_kit:stick", function(e) {
							$(this).parent('div').css({'position':'static'});
						});
					} else {
						$(".sticky-sidebar").trigger("sticky_kit:detach");
					}
				});
			}
		}, 1000);
	};

	FINTHEME.init = function() {
		FINTHEME.CommonUtils();
		FINTHEME.IsotopeLayout();
		FINTHEME.owlCarousel($('body'));
		FINTHEME.VcAnimations();
		FINTHEME.stickyElements();
		FINTHEME.VcProgressBar();
		FINTHEME.VcCounter();
		FINTHEME.blogInfiniteScroll();
		FINTHEME.PortfolioSmartMenuNew();
		$(window).smartresize( function() {
			FINTHEME.PortfolioSmartMenuNew();
		});
		
		FINTHEME.VcCustomCss();
		setTimeout ( function () {
			FINTHEME.VcModalBox();
		}, 300 );
	}
	FINTHEME.init();
	
	$(window).load(function() {
		FINTHEME.IsotopeLayout();
		FINTHEME.VcModalBoxOnload();
	});
	
})(jQuery);	

function zozo_InitJs() {
    zozo_IsotopeRow();
	jQuery(document).trigger("zozo_InitJs");
}

window.zozoParallaxSkroll = false;
"function" != typeof window.zozo_IsotopeRow && ( window.zozo_IsotopeRow = function() {
	function IsotopefullWidth() {
		var $elements = $('[data-vc-full-width="true"]').find('.zozo-isotope-grid-system');
		$.each($elements, function(key, item) {
			var $el = $(this),
			scrollbarWidth;
			
			if( scrollbarWidth == undefined) {
				// Create the measurement node
				var scrollDiv = document.createElement("div");
				scrollDiv.className = "scrollbar-measure";
				var dombody = document.body;
				if (dombody != null) {
					dombody.appendChild(scrollDiv);
					// Get the scrollbar width
					scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
					// Delete the DIV
					dombody.removeChild(scrollDiv);
				}
			}
			
			var wwidth = window.innerWidth || document.documentElement.clientWidth;
			
			//if ( $el.parents( $( '.vc_row' ).data('vc-full-width') == "true" ) ) {
				var elWidth = $el.offsetWidth,
					newWidth = 12 * Math.ceil((wwidth - scrollbarWidth) / 12);
				
				boxWidth = newWidth;
				boxLeft = Math.ceil(((newWidth) - wwidth) / 2);
				
				$el.css({
					width: boxWidth + 'px',
					marginLeft: '-' + (boxLeft + (scrollbarWidth / 2)) + 'px'					
				});
			//}
		});
	}
	
	function ZozofullWidthRow() {
		var rtl = $('body').hasClass('rtl') ? true : false;
		
		if( rtl == true ) {
			var $elements = $('[data-vc-full-width="true"]');
			$.each($elements, function(key, item) {
				var $el = $(this);
				var $el_full = $el.next(".vc_row-full-width");
                $el_full.length || ($el_full = $el.parent().next(".vc_row-full-width"));
                var el_margin_right = parseInt($el.css("margin-right"), 10); 
					
				var offset = 0 - ( $(window).width() - ( $el_full.offset().left + $el_full.outerWidth() - el_margin_right ) );
				
				$el.css({                      
                	right: offset
                });
			});
		}
	}
	
	function ZozoParallaxTitleBar() {
		var zozoSkrollrOptions, zozocallSkrollInit = false;
		
		if( window.zozoParallaxSkroll ) {
			window.zozoParallaxSkroll.destroy();
		}
		$( '.zozo_parallax-inner' ).remove();
		
		$( '[data-zozo-parallax]' ).each( function () {
			var skrollrSpeed,
				skrollrSize,
				skrollrStart,
				skrollrEnd,
				$parallaxElement,
				parallaxImage,
				parallaxPos;
				
			zozocallSkrollInit = true; // Enable skrollinit;

			skrollrSize = $( this ).data( 'zozoParallax' ) * 100;
			$parallaxElement = $( '<div />' ).addClass( 'zozo_parallax-inner' ).appendTo( $( this ) );
			$parallaxElement.css( 'height', skrollrSize + '%' );

			parallaxImage = $( this ).data( 'zozoParallaxImage' );
			parallaxPos = $( this ).data( 'zozoParallaxPosition' );
			
			if ( 'undefined' !== typeof(parallaxImage) ) {
				$parallaxElement.css( 'background-image', 'url(' + parallaxImage + ')' );
			}

			skrollrSpeed = skrollrSize - 100;
			skrollrStart = - skrollrSpeed;
			skrollrEnd = 0;
			
			if( parallaxPos == 'left top' || parallaxPos == 'right top' || parallaxPos == 'center top' || parallaxPos == 'left center' || parallaxPos == 'right center' ) {
				$parallaxElement.css( 'bottom', '0px' );
				$parallaxElement.attr( 'data-center', 'top: 0%;' );
				$parallaxElement.attr( 'data-bottom-top', 'top: ' + skrollrEnd + '%;' ).attr( 'data-top-bottom', 'top: ' + skrollrStart + '%;' );
			} 
			else if( parallaxPos == 'center bottom' || parallaxPos == 'left bottom' || parallaxPos == 'right bottom' ) {
				$parallaxElement.css( 'bottom', '0px' );
				$parallaxElement.attr( 'data-center', 'bottom: 0%;' );
				$parallaxElement.attr( 'data-bottom-top', 'bottom: ' + skrollrEnd + '%;' ).attr( 'data-top-bottom', 'bottom: ' + skrollrStart + '%;' );
			}
			else if( parallaxPos == 'center center' ) {
				$parallaxElement.css( 'top', '0px' );
				$parallaxElement.attr( 'data-bottom-top', 'top: ' + skrollrStart + '%;' ).attr( 'data-top-bottom', 'top: ' + skrollrEnd + '%;' );
			}
		} );
		
		if( ! $('body').find('[data-vc-parallax]').hasClass('vc_parallax') ) {
			if( zozocallSkrollInit && window.skrollr ) {
				zozoSkrollrOptions = {
					forceHeight: false,
					smoothScrolling: false,
					mobileCheck: function () {
						return false;
					}
				};
				window.zozoParallaxSkroll = skrollr.init( zozoSkrollrOptions );
				return window.zozoParallaxSkroll;
			}
			return false;
		}
		return false;
	}
	
	var $ = window.jQuery;
	$(window).off("resize.zozo_IsotopeRow");
	$(window).on("resize.zozo_IsotopeRow", IsotopefullWidth);
	$(window).on("resize.zozo_IsotopeRow", ZozofullWidthRow);
	IsotopefullWidth();
	ZozofullWidthRow();
	ZozoParallaxTitleBar();
});

jQuery(window).scroll(function() {
	"use strict";
	
	get_scroll = jQuery(window).scrollTop();
});

jQuery(window).load(function() {	
	
	jQuery('body').find(".pageloader").delay(1000).fadeOut("slow");
	
	/* ======================================
	Scroll to Section if Hash exists
	====================================== */
	if( window.location.hash ) {
		setTimeout ( function () {
			jQuery.scrollTo( window.location.hash, 2000, { easing: 'easeInOutExpo', offset: 0, "axis":"y" } );
		}, 400 );
	}		

});

jQuery(document).ready(function($) {

	window.zozo_InitJs();
	
	$('.zo-tooltip').tooltip({
		animation: true
	});
	
	(function($) {
		"use strict";
		
		/* =============================
		Active Scrollspy Navigation
		============================= */
		$('.main-nav, .main-right-nav').each(function() {
			$(this).find('a[href]').each(function(i,a){
				var $a = $(a);
				var href = $a.attr('href');
				var target;
				
				// Get Splitted ID from page's URI in href tag
				target = href.substring(href.indexOf('#') + 1); 
				
				// update anchors TARGET with new one
				if(target.indexOf('section-') == 0) {  
					$a.attr('data-target', '#' + target);
				} else {
					$a.addClass('external-link');
				}
							
			});
		});
		
		if( $('body').hasClass('header-is-sticky') ) {
			if( $(".header-section").hasClass( 'type-header-11' ) ) {
				var sticky_height = fintheme_js_vars.zozo_sticky_height_alt;
			} else {
				var sticky_height = fintheme_js_vars.zozo_sticky_height;
			}
			
			var scroll_offset = sticky_height.match(/\d+/);
			
			if( scroll_offset !== null && scroll_offset != 0 ) {
				scroll_offset = scroll_offset - 2;
			}
		} else {
			var scroll_offset = -2;
		}
		
		if(Modernizr.mq('only screen and (max-width: 767px)')) {
			if( $('body').hasClass('header-mobile-un-sticky') ) {
				var scroll_offset = -2;
			}
		}
		
		$('.main-nav, .main-right-nav').onePageNav({
			currentClass: 'active',
			filter: ':not(.external-link)',
			scrollSpeed: 1100,
			scrollOffset: scroll_offset,
			scrollThreshold: 0.1,
			easing: 'easeInOutExpo',
		});
		
		$('.main-nav, .main-right-nav').each(function() {
			$(this).find('ul.navbar-nav > li.menu-item-language').each(function() {
				if( $(this).find('ul.sub-menu').hasClass('submenu-languages') ) {
					$(this).addClass('dropdown');
					$(this).find('> a').addClass('dropdown-toggle');
					$(this).find('ul.sub-menu').addClass('dropdown-menu');
				}
			});
		});
		
		$( '.smoothscroll, .smoothscroll > a' ).on('click', function() {
			$('html, body').animate({
				scrollTop: $( $(this).attr('href') ).offset().top - scroll_offset
			}, 1100);
			return false;
		});
		
		$( '.zozo-fit-video' ).fitVids();
		
		
		/* ======================== VC Column Match Height ======================== */
		  var zozoVcColumnMatchHeight = {
		   Init: function() {
			$('.vc-normal-section').each(function() {
			 if( $(this).hasClass('vc-match-height-row') ) {    
			  if( ! ( $(this).find('.wpb_column.vc_main_column.vc_column_container').hasClass( 'vc-match-height-content' ) ) ) {
			   $(this).find('.wpb_column.vc_main_column.vc_column_container').addClass( 'vc-match-height-content' );
			  }
			 }
			});
			
			$('.vc-inner-row-section').each(function() {
			 if( $(this).hasClass('vc-match-height-inner-row') ) {
			  if( ! ( $(this).find('.wpb_column.vc_column_inner.vc_column_container').hasClass( 'vc-inner-match-height-content' ) ) ) {
			   $(this).find('.wpb_column.vc_column_inner.vc_column_container').addClass( 'vc-inner-match-height-content' );
			  }
			 }
			});
			
			if(Modernizr.mq('only screen and (min-width: 768px)')) { 
			 $('.vc-match-height-row').each(function() {
			  if( $(this).find( '.vc-match-height-content' ).hasClass( 'vc_col-sm-12' ) ) {
			   $(this).find( '.vc-match-height-content' ).matchHeight({ byRow: false });
			  } else {
			   $(this).find( '.vc-match-height-content' ).matchHeight({ byRow: true }); 
			  }
			  if( $(this).find( '.vc-match-height-content' ).hasClass( 'vc-zozo-video-wrapper' ) ) {
			   var height = $(this).find( '.vc-match-height-content' ).height();
			   $(this).find( '.vc-match-height-content .video-bg' ).css({ height: height + 'px' });
			   $(this).find( '.vc-match-height-content .video-bg .zozo-yt-player' ).css({ height: height + 'px' });
			  }
			 });
			 
			 $('.vc-match-height-inner-row').each(function() {
			  $(this).find( '.vc-inner-match-height-content' ).matchHeight({ byRow: true });
			 });
			}
			
			if(Modernizr.mq('only screen and (max-width: 767px)')) {
			 $('.vc-match-height-row').each(function() {
			  $(this).find( '.vc-match-height-content' ).matchHeight({ byRow: false });
			  if( $(this).find( '.vc-match-height-content' ).hasClass( 'vc-zozo-video-wrapper' ) ) {
			   var height = $(this).find( '.vc-match-height-content' ).height();
			   $(this).find( '.vc-match-height-content .video-bg' ).css({ height: height + 'px' });
			   $(this).find( '.vc-match-height-content .video-bg .zozo-yt-player' ).css({ height: height + 'px' });
			  }
			 });
			 
			 $('.vc-match-height-inner-row').each(function() {
			  $(this).find( '.vc-inner-match-height-content' ).matchHeight({ byRow: false });
			 });
			}
		   }
		  };
		  zozoVcColumnMatchHeight.Init();
		  $(window).smartresize( function() {
		   zozoVcColumnMatchHeight.Init(); 
		  });

	})(jQuery);
	
	
	// Megamenu
	zozo_MegaMenuHeight();
		$(window).smartresize( function() {
		zozo_MegaMenuHeight();		
	});
	// Secondary Menu
	zozo_initSecondaryMenu();
	// Tweets Widget Slider
	zozo_Tweets_Slider();
	// Circle Counter
	zozo_CircleRSliderInit();
	$(window).smartresize( function() {
		zozo_CircleRSliderInit();
	});
	zozo_initCircleCounter();

	zozo_FooterHeight();
	$(window).smartresize( function() {
		zozo_FooterHeight();
	});
	
	(function($) {
		"use strict";		
		
		
		/* =======================
		Sticky Header
		======================= */
		
		var zozoStickyHeader = {
			Init: function() {
				if( $('body').hasClass('header-is-sticky') ) {
					var spacing = 0,
					stickyHeader = $('#header-main');
					
					if( $('#wpadminbar').length > 0 ) {
						spacing = 32;
					}
					
					stickyHeader.sticky({
						topSpacing: spacing,
						wrapperClassName: 'header-sticky'
					});
					
					$(window).smartresize( function() {
						stickyHeader.sticky('update');
					});
					
					if(  $(".header-section").hasClass( 'type-header-11' ) ) {
						stickyHeader.on('sticky-start', function() {
							var sticky_height = fintheme_js_vars.zozo_sticky_height_alt;
							stickyHeader.parent('.header-sticky').css({ "min-height": sticky_height, "height": "auto" });
						});
					} else {
						$('#header-main').on('sticky-start', function() {
							var sticky_height = fintheme_js_vars.zozo_sticky_height;
							stickyHeader.parent('.header-sticky').css({ "min-height": sticky_height, "height": "auto" });
						});
					}
					
					// Sticky Header Hiding
					if( $('body').hasClass('header-sticky-hide') ) {
						var lastTop = 0;

						$(window).scroll(function(event){
							var currentTop = $(this).scrollTop();
							var headerHide = 800;
							
							if( $('#zozo_wrapper .zozo-revslider-section').length > 0 && $('body').hasClass('rev-position-header-below') ) {
								var slider = $('#zozo_wrapper .zozo-revslider-section'),
									sliderTop = slider.offset().top,
									sliderHeight = slider.height();
									
								headerHide = sliderTop + sliderHeight;
							}
							
							if( currentTop > lastTop && currentTop > headerHide ) {
								stickyHeader.addClass('sticky-header-hide');
							} else if( stickyHeader.hasClass('sticky-header-hide') ) {
								stickyHeader.removeClass('sticky-header-hide');
							}
							lastTop = currentTop;
						});
					}
				}
			},			
			MobileSticky: function() {
				if( $('body').hasClass('header-mobile-is-sticky') ) {
					var mobileHeader = $('#mobile-header'),
						spacing = 0;
						
					if( $('#wpadminbar').length > 0 ) {
						spacing = 32;
					}
	
					mobileHeader.sticky({
						topSpacing: spacing,
						wrapperClassName: 'header-mobile-sticky'
					});
	
					$(window).smartresize( function() {
						mobileHeader.sticky('update');
					});
					
					// Sticky Header Hiding
					if( $('body').hasClass('header-sticky-hide') ) {
						var lastTop = 0;
	
						$(window).scroll(function(event){
							var currentTop = $(this).scrollTop();
							var headerHide = 800;
							
							if( $('#zozo_wrapper .zozo-revslider-section').length > 0 && $('body').hasClass('rev-position-header-below') ) {
								var slider = $('#zozo_wrapper .zozo-revslider-section'),
									sliderTop = slider.offset().top,
									sliderHeight = slider.height();
									
								headerHide = sliderTop + sliderHeight;
							}
								
							if( currentTop > lastTop && currentTop > headerHide ) {
								mobileHeader.addClass('sticky-header-hide');
							} else if( mobileHeader.hasClass('sticky-header-hide') ) {
								mobileHeader.removeClass('sticky-header-hide');
							}
							lastTop = currentTop;
						});
					}
				}
				
			}
		};

		if( $('body').hasClass('header-is-sticky') ) {
			zozoStickyHeader.Init();
		}
		if( $('body').hasClass('header-mobile-is-sticky') ) {
			zozoStickyHeader.MobileSticky();
		}
		
		
		
		var zozoFullscreenSearch = {

			Init: function() {
				$('.fullscreen-search-trigger').on('click', function(e) {
					e.preventDefault();
					var searchInput = $('#header-fullscreen-search').find('.search-form input.form-control');
					setTimeout(function() {
						$('body').removeClass('fullscreen-search-closing');
						$('body').addClass('fullscreen-search-open');
						searchInput.focus();
					}, 30);
				});
				
				$('a.fullscreen-search-close').on('click', function(e) {
					e.preventDefault();	
					
					if( $('body').hasClass('fullscreen-search-open')) {
						$('body').removeClass('fullscreen-search-open');
						$('body').addClass('fullscreen-search-closing');
					}
				});
			}
		};
		zozoFullscreenSearch.Init();
		
		var zozoMobileMenu = {

			mobileMenuInit: function() {
				
				$('.mobile-menu-search').on('click', function(e) {
					e.preventDefault();
					var searchInput = $('#mobile-search-wrapper').find('.search-form .form-control');
					setTimeout(function() {
						$('body').removeClass('mobile-search-closing');
						$('body').addClass('mobile-search-open');
						searchInput.focus();
					}, 30);
				});
				
				$('a.mobile-search-close').on('click', function(e) {
					e.preventDefault();	
					
					if( $('body').hasClass('mobile-search-open')) {
						$('body').removeClass('mobile-search-open');
						$('body').addClass('mobile-search-closing');
					}
				});
				
				// Hide on resize
				$(window).smartresize( function() {
	
					var windowWidth = $(window).width();
	
					if( windowWidth > 1024 && $('body').hasClass('mhv-tablet-land') ) {
						zozoMobileMenu.hideMobileMenuTrigger();
					} else if( windowWidth > 991 && $('body').hasClass('mhv-tablet-port') ) {
						zozoMobileMenu.hideMobileMenuTrigger();
					} else if( windowWidth > 767 && $('body').hasClass('mhv-mobile') ) {
						zozoMobileMenu.hideMobileMenuTrigger();
					}
	
				});
			},
			showMobileMenu: function() {
				$('body').addClass('mobile-menu-open');
			},
			hideMobileMenu: function() {
				$('body').addClass('mobile-menu-closing');
				$('body').removeClass('mobile-menu-open');
				setTimeout(function() {
					$('body').removeClass('mobile-menu-closing');
				}, 1000);
			},
			hideMobileMenuTrigger: function(e) {
				if(e) {
					e.preventDefault();
				}
				$('body').addClass('mobile-menu-closing');
				zozoMobileMenu.hideMobileMenu();
			},
			mobileMenuNavInit: function() {
				$('.main-mobile-nav').each(function(){
					var menu = $(this),
					menuList = menu.find('.zozo-main-nav'),
					subMenu = menu.find('.mobile-sub-menu');

					if( menu.find('.submenu-toggle').length === 0 ) {
						menu.find('.menu-item-has-children').find('span.menu-toggler').remove();
						if( menu.find('.menu-item-has-children').hasClass('mobile-megamenu-enabled') ) {
							menu.find('.menu-item-has-children').children('.zozo-megamenu-title').wrap('<div class="toggle-wrapper"></div>');
							menu.find('.menu-item-has-children > .toggle-wrapper').children('.zozo-megamenu-title').after('<span class="submenu-toggle"><i class="fa fa-angle-right"></i></span>');
							
						}
						menu.find('.menu-item-has-children').children('a').wrap('<div class="toggle-wrapper"></div>');
						menu.find('.menu-item-has-children > .toggle-wrapper').children('a').after('<span class="submenu-toggle"><i class="fa fa-angle-right"></i></span>');
						
						menuList.on('click', '.submenu-toggle',function(e){
							e.preventDefault();
							$(this).parent().siblings('.mobile-sub-menu').addClass('sub-menu-active');
						});
					}
					subMenu.each(function() {
						var $this = $(this);
						if($this.find('.back-to-menu').length === 0){
							$this.prepend('<li class="back-to-menu"><a href="#">' + fintheme_js_vars.zozo_back_menu + '</a></li>');
						}
						menu.on('click','.back-to-menu a',function(e){
							e.preventDefault();
							$(this).parent().parent().removeClass('sub-menu-active');
						});
					});
					menu.on('click',function(e){
						e.stopPropagation();
					});
				});
			}
		};
		zozoMobileMenu.mobileMenuInit();
		zozoMobileMenu.mobileMenuNavInit();
		
		/* Add active class for Toggle in menu */
		$('.nav.navbar-nav li span.menu-toggler').on('click', function() {
			$(this).parent('.dropdown').toggleClass('toggle-open');
		});
		
		// Responsive Auto Close Menu
		$('.main-nav .nav.navbar-nav li a:not(.external-link), .main-right-nav .nav.navbar-nav li a:not(.external-link)').on('click', function() {
			$(this).parents('.zozo-header-main-bar.navbar-collapse').removeClass('in');
			zozoMobileMenu.hideMobileMenuTrigger();
		});
		
		var sliding_bar_state = 0;
		
		
		if( $('body').find('.rev_slider_wrapper .rev_slider').length ) {
			$('body').addClass('rev_slider-active');
		}
		
	})(jQuery);
	
	(function($) {
		"use strict";
		
		/* Nav Search Bar */
		$('.header-main-right-search .btn-trigger').on('click', function() {
			var search_form_ele = $(this).parent('.header-main-right-search').find('.search-form');
			$(search_form_ele).fadeToggle("slow");
			$(search_form_ele).find("input.form-control").focus();
			$(this).toggleClass('flaticon-shapes');
		});
		
		/* Toggle Search, Phone, Email */	
		$('.toggle-bar-item.item-contact-phone .phone-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-contact-phone').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.toggle-bar-item.item-contact-email .email-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-contact-email').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.zozo-header-main-bar .item-search-toggle .search-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-toggle-search').fadeToggle("fast");
			$(this).parents('.zozo-header-main-bar').find('#header-toggle-search input.form-control').focus();
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.toggle-bar-item.item-social-toggle .social-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-toggle-social').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.toggle-bar-item.item-text .text-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-custom-text').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.toggle-bar-item-level.item-address-details .address-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-address-details').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.toggle-bar-item-level.item-business-hours .business-trigger').on('click', function() {
			$(this).parents('.zozo-header-main-bar').find('#header-business-hours').fadeToggle("fast");
			$(this).parents('#header-main').addClass("header-toggle-visible");
		});
		
		$('.btn-toggle-close').on('click', function() {
			$(this).parent('.header-toggle-content').fadeToggle("fast");
			$(this).parents('#header-main').removeClass("header-toggle-visible");
		});		
	
		// PrettyPhoto	
		$("a[rel^='prettyPhoto'], a[data-rel^='prettyPhoto']").prettyPhoto({
			hook: 'data-rel', 
			social_tools: false, 
			deeplinking: false,
			changepicturecallback: function(){
				var $pp_pic_holder = $('.pp_pic_holder'),
				$pp_inline = $('.pp_pic_holder').find('.pp_inline');
				if( $pp_inline.find('> .wp-audio-shortcode').hasClass( 'mejs-container' ) ) {
					var $audio_html = $pp_inline.find('> .wp-audio-shortcode .mejs-mediaelement').html();
					$pp_inline.html( $audio_html );
					$pp_inline.find('> .wp-audio-shortcode').not( '.mejs-container' ).mediaelementplayer();
				}
			}
		});
		
	})(jQuery);
	
	/* =============================
	Back To Top
	============================= */
	$(document).on( 'click', '#zozo-back-to-top a', function( event ) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
	});	
	
	/* =============================
	Shortcodes
	============================= */	
	$(".zozo-tooltip").tooltip();	
	$(".zozo-popover").popover();
	
	/* ============================= Progress Bar ============================= */
	var bar = $('.progress-bar');
	$(bar).appear(function() {
		bar_width = $(this).attr('aria-valuenow');
		$(this).width(bar_width + '%');
		$(this).find('span').fadeIn(4000);
	});
	
	/* ============================= Append Modal Outside all Containers ============================= */
	$(".zozo-modal").each( function() {
		$(".wrapper-class").append( $(this) );
	});

	$(".zozo-testimonial.slide").find(".item:first").addClass("active");
	$(".zozo-testimonial.slide").find(".carousel-indicators li:first").addClass("active");
		
	$('.widget_categories').find("ul:not(.children)").each(function() {
		$(this).addClass("categories");
	});	
	
	var cat_item = 1;	
	$('.sidebar .widget_categories').find("ul.categories > li").each(function() {
		if( cat_item == 5 ) {
			cat_item = 1;
		}
		$(this).addClass("category-item-" + cat_item);
		cat_item++;
		
		if( ! $(this).hasClass( "current-cat-parent" ) ) {
			if( $(this).find("ul.children > li").hasClass( "current-cat" ) ) {
				$(this).addClass( "current-parent" );
			}
		}
	});
			
	/* Animation */	
	$('.animated').appear(function() {
		var elem = $(this);
		var animation = elem.data('animation');		
		if ( !elem.hasClass('visible') ) {
			var animationDelay = elem.data('animation-delay');
			if ( animationDelay ) {
	
				setTimeout(function(){
					elem.addClass( animation + " visible" );					
				}, animationDelay);			
	
			} else {
				elem.addClass( animation + " visible" );
			}
		}		
	});
	
	/* ===================
	Video Script
	=================== */
	$('.wrapper-class').find(".zozo-yt-player").each(function() {
		 if (typeof $.fn.mb_YTPlayer != 'undefined' && $.isFunction($.fn.mb_YTPlayer)) {
			var m = false;
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent)) {
				m = true;
			}
			var v = $(this);
			if (m == false) {
				v.mb_YTPlayer();
				v.parent().find('.zozo-video-controls a').each(function() {
					var t = $(this);
                    t.on('click', (function(e) {
						e.preventDefault();
						if (t.hasClass('fa-volume-off')) {
							t.removeClass('fa-volume-off').addClass('fa-volume-down');
							v.unmuteYTPVolume();
							return false;
						}
                        if (t.hasClass('fa-volume-down')) {
                        	t.removeClass('fa-volume-down').addClass('fa-volume-off');
                            v.muteYTPVolume();
                            return false;
                        }
                        if (t.hasClass('fa-pause')) {
                        	t.removeClass('fa-pause').addClass('fa-play');
							v.pauseYTP();
							return false;
						}
						if (t.hasClass('fa-play')) {
							t.removeClass('fa-play').addClass('fa-pause');
							v.playYTP();
							return false;
						}
					}));
				});
				v.parent().find('.zozo-video-controls').show();
			}
		 }
	});
		
	
	// Mailchimp Form
	$('.zozo-mailchimp-form').each(function(){
		var $this = $(this);
		var mailchimp_form_validator = new FormValidator( $(this).attr('name'), [
			{
				name: 'subscribe_email',
				display: $(this).data('email_not_empty'),
				rules: 'required|valid_email'
			}],
			function( errors, evt ) {
			
				evt.preventDefault();
				
				if( errors.length > 0 ) {
					
					var fields = [];
					var data_fields = { "form_fields": fields };
					$.each($(evt.target).serializeArray(), function(i, field) {
						fields[i] = {};
						fields[i]['name'] = field.name;
						fields[i]['value'] = field.value;
						
						$this.find( '#' + field.name ).parents('.form-group').removeClass('has-feedback has-error');
						$this.find( '#' + field.name ).parents('.form-group').find('.form-control-feedback').tooltip('destroy');
						$this.find( '#' + field.name ).parents('.form-group').find('.form-control-feedback').remove();
					});
					
					for( var i = 0, errorLength = errors.length; i < errorLength; i++ ) {
						$this.find( '#' + errors[i].id ).parents('.form-group').addClass('has-feedback has-error');
						$this.find( '#' + errors[i].id ).parents('.form-group').append('<i style="cursor: pointer;" class="form-control-feedback glyphicon glyphicon-remove" title="'+ errors[i].message +'"></i>');
						
						$this.find( '#' + errors[i].id ).parents('.form-group').find('.form-control-feedback').tooltip({
							container: 'body',
							html: true,
							placement: 'auto top'
						});
						
						$this.find( '#' + errors[i].id ).off('focus').on('focus', function() {
							$(this).parents('.form-group').find('.form-control-feedback').tooltip('show');
                        }).off('blur').on('blur', function() {
                        	$(this).parents('.form-group').find('.form-control-feedback').tooltip('hide');
                        });
					}
					
					var first_element = 0;
					$.each(data_fields.form_fields, function( i, currField ) {
						$.each(currField, function( key, val ) {
							if( key == 'name' ) {
								if( $this.find( '#' + val ).parents('.form-group').hasClass('has-error') ) {
									first_element = 1;
									$this.find( '#' + val ).focus();
								}
							}
							if( first_element == 1 ) {
								return false;
							}
						});
						if( first_element == 1 ) {
							return false;
						}
					});
					
				} else {
			
					var $form        = $(evt.target),
					submitButton     = $form.find('.zozo-submit');
					
					$form.addClass('ajax-loader');
					var getid = $form.attr('id');
					
					var data = $('#' + getid).serialize();
					
					afterSubmissionForm( $('#' + getid), submitButton );
				
					$.ajax({
						url: fintheme_js_vars.zozo_ajax_url,
						type: "POST",
						dataType: 'json',
						data: data + '&action=zozo_mailchimp_subscribe',
						success: function (msg) {
							console.log('Ajax function success');
							$form.removeClass('ajax-loader');
							if( msg.success ) {
								$form.parent().find('.zozo-form-success').html(msg.message);
								$form.parent().find('.zozo-form-success').show();
								resetForm( $('#' + getid) );
							} else {
							$form.parent().find('.zozo-form-error').html(msg.message);
							$form.parent().find('.zozo-form-error').show();
							}
						},
						error: function(msg) {}
						
					});
			
					return false;
				}
			});
		
		mailchimp_form_validator.setMessage('required', '%s');
		mailchimp_form_validator.setMessage('valid_email', $(this).data('email_valid'));
	});
	
	function afterSubmissionForm($form, submitButton) {
		$form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parents('.form-group').removeClass('has-feedback has-error');
		$form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parents('.form-group').find('.form-control-feedback').tooltip('destroy');
		$form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parents('.form-group').find('.form-control-feedback').remove();
	}

	function resetForm($form) {
		$form.find('input:text, input:password, input[type!="hidden"], input:file, select, textarea').val('');
		$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');        
		$form.find('#subscribe_email').val('');
		$form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parents().find('.form-control-feedback').hide();
	}
	
	/* ======================== Day Counter ======================== */
	(function($) { 
		"use strict";
		$('.zozo-daycounter').each(function(){
			var counter_id = $(this).attr('id');
			var counter_type = $(this).data('counter');
			var year = $(this).data('year');
			var month = $(this).data('month');
			var date = $(this).data('date');
			
			var countDay = new Date();
			countDay = new Date(year, month - 1, date);
			
			if( counter_type == "down" ) {
				$("#"+counter_id).countdown({
					labels: [fintheme_js_vars.zozo_CounterYears, fintheme_js_vars.zozo_CounterMonths, fintheme_js_vars.zozo_CounterWeeks, fintheme_js_vars.zozo_CounterDays, fintheme_js_vars.zozo_CounterHours, fintheme_js_vars.zozo_CounterMins, fintheme_js_vars.zozo_CounterSecs],
					labels1: [fintheme_js_vars.zozo_CounterYear, fintheme_js_vars.zozo_CounterMonth, fintheme_js_vars.zozo_CounterWeek, fintheme_js_vars.zozo_CounterDay, fintheme_js_vars.zozo_CounterHour, fintheme_js_vars.zozo_CounterMin, fintheme_js_vars.zozo_CounterSec],
					until: countDay
				});
			} else if( counter_type == "up" ) {
				$("#"+counter_id).countdown({
					labels: [fintheme_js_vars.zozo_CounterYears, fintheme_js_vars.zozo_CounterMonths, fintheme_js_vars.zozo_CounterWeeks, fintheme_js_vars.zozo_CounterDays, fintheme_js_vars.zozo_CounterHours, fintheme_js_vars.zozo_CounterMins, fintheme_js_vars.zozo_CounterSecs],
					labels1: [fintheme_js_vars.zozo_CounterYear, fintheme_js_vars.zozo_CounterMonth, fintheme_js_vars.zozo_CounterWeek, fintheme_js_vars.zozo_CounterDay, fintheme_js_vars.zozo_CounterHour, fintheme_js_vars.zozo_CounterMin, fintheme_js_vars.zozo_CounterSec],
					since: countDay
				});
			}
			
		});
	})(jQuery);	
	


}); //End document ready function

function zozo_FooterHeight(){
	"use strict";
	
	if(Modernizr.mq('only screen and (min-width: 768px)')) {
		if( jQuery('body').hasClass('footer-hidden') ) {
			var footer_height = jQuery('.footer-section.footer-style-hidden').innerHeight();
			jQuery('.footer-section.footer-style-hidden').css({ height: footer_height + 'px' });
			jQuery('.footer-hidden .wrapper-inner').css({ 'margin-bottom': footer_height + 'px' });
		}
		if( jQuery('body').hasClass('footer-sticky') ) {
			var copyright_height = jQuery('.footer-section.footer-style-sticky .footer-copyright-section').innerHeight();
			jQuery('.footer-section.footer-style-sticky .footer-widgets-section').css({ 'margin-bottom': copyright_height + 'px' });
		}
	} else {
		if( jQuery('body').hasClass('footer-hidden') ) {
			jQuery('.footer-section.footer-style-hidden').css({ height: 'auto' });
			jQuery('.footer-hidden .wrapper-inner').css({ 'margin-bottom': '0px' });
		}
		if( jQuery('body').hasClass('footer-sticky') ) {
			jQuery('.footer-section.footer-style-sticky .footer-widgets-section').css({ 'margin-bottom': '0px' });
		}	
	}
}

var get_current_scroll;
function zozo_initSecondaryMenu(){
	"use strict";

	jQuery('.side-menu a.secondary_menu_button, a.secondary_menu_close').on('click', function(event) {
		event.preventDefault();
		if( !jQuery('.side-menu a.secondary_menu_button' ).hasClass('active')){			
			if( jQuery('.secondary_menu').hasClass('right') ) {
				jQuery('body').addClass('side_right_menu_active');
				
				var right_menu_width =  jQuery('.secondary_menu.right').width() / jQuery('body').width() * 100;
				right_menu_width = Math.round(right_menu_width);
		
				jQuery('.side_right_menu_active .wrapper-class').animate({ left: "-" + right_menu_width + '%' }, "slow");
				jQuery('.secondary_menu').animate({right: '0px'}, "slow");
			}
			else if( jQuery('.secondary_menu').hasClass('left') ) {
				jQuery('body').addClass('side_left_menu_active');
				jQuery('.side_left_menu_active').css({ 'overflow-x':'hidden' });
				
				var left_menu_width =  jQuery('.secondary_menu.left').width() / jQuery('body').width() * 100;
				left_menu_width = Math.round(left_menu_width);
				jQuery('.side_left_menu_active .wrapper-class').animate({ left: left_menu_width + '%' }, "slow");				
				jQuery('.secondary_menu').animate({left: '0px'}, "slow");
			}
			
			jQuery(this).addClass('active');
			
		} else {			
			if( jQuery('.secondary_menu').hasClass('right') ) {
			
				var right_menu_width =  jQuery('.secondary_menu.right').width() / jQuery('body').width() * 100;
				right_menu_width = Math.round(right_menu_width);
	
				jQuery('.side_right_menu_active .wrapper-class').animate({ left: '0px' }, "slow");
				jQuery('body').removeClass('side_right_menu_active');
				jQuery('.secondary_menu').animate({right: "-" + right_menu_width + '%'}, "slow");
				
			}
			else if( jQuery('.secondary_menu').hasClass('left') ) {
				
				var left_menu_width =  jQuery('.secondary_menu.left').width() / jQuery('body').width() * 100;
				left_menu_width = Math.round(left_menu_width);
				
				jQuery('.side_left_menu_active .wrapper-class').animate({ left: '0px' }, "slow");
				jQuery('body').removeClass('side_left_menu_active');
				jQuery('.secondary_menu').animate({left: "-" + left_menu_width + '%'}, "slow");
				
			}
			
			jQuery('.side-menu a.secondary_menu_button').removeClass('active');
		}
	});
}

function zozo_MegaMenuHeight() {
	if( ! jQuery('.header-section').find('#header-side-nav').length ) {
		if( jQuery('.header-section').find( '.main-megamenu' ).length ) {
			jQuery('.header-section').find('.main-megamenu .zozo-main-nav > li').each(function(){
				var li_item = jQuery( this ),
				megamenu_wrapper = li_item.find( '.zozo-megamenu-wrapper' );
								
				if( megamenu_wrapper.length ) {
					megamenu_wrapper.removeAttr( 'style' );
					
					var megamenu_wrapper_top = megamenu_wrapper.offset().top,
					megamenu_new_height = jQuery( window ).height() - megamenu_wrapper_top - 20;
				
					if( megamenu_wrapper.height() > jQuery( window ).height() ) {
						megamenu_wrapper.css({ 'max-height': megamenu_new_height, 'overflow-y': 'auto' });
						jQuery(".header-section .zozo-megamenu-wrapper").mCustomScrollbar({
							setHeight: false,
							scrollButtons: {enable:true},
							theme: "minimal",
							scrollbarPosition: "inside",
							mouseWheel:{ scrollAmount: 500 }
						});
					}
				}
			});
		}
	}
}

function zozo_MenuScrollBar( element_wrapper, scroller_element ) {
	if( element_wrapper.height() > jQuery( window ).height() ) {
		element_wrapper.css({ 'max-height': jQuery( window ).height(), 'overflow-y': 'auto' });
		jQuery( scroller_element ).mCustomScrollbar({
			setHeight: false,
			scrollButtons: {enable:true},
			theme: "minimal",
			scrollbarPosition: "inside",
			mouseWheel:{ scrollAmount: 500 }
		});
	}
}

function zozo_Tweets_Slider() {
	jQuery('.zozo-twitter-slide').each(function() {
		var visible = jQuery(this).data('visible');
		jQuery('.zozo-twitter-slide').easyTicker({
			direction: 'up',
			speed: 'slow',
			interval: 3000,
			height: 'auto',
			visible: visible,
			mousePause: 0,
		});	
	});
}

/* ======================== Circle Counter Responsive Carousel Slider ======================== */

function zozo_CircleRSliderInit() {
	
	jQuery('.zozo-circle-counter-wrapper').each( function() {
		var slider_id = jQuery(this).find('.owl-carousel').attr('id');
		
		if(Modernizr.mq('only screen and (max-width: 991px)')) {
			if( slider_id == null || slider_id == undefined ) {
				jQuery(this).find('.zozo-circle-counter.circle-no-slider').owlCarousel({
					dots            : false,
					items           : 1,
					slideBy         : 1,
					loop            : false,				
					nav             : true,
					autoplay        : true,
					autoplayTimeout : 5000,
					navText         : [ '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>' ],
					responsiveClass : true,
					responsive      : {
						0: {
							items   : 1
						},
						480: {
							 items  : 1
						},
						768: {
							items   : 1
						},
						992: {
							items   : 1
						}
					}
				});
			}		
		} else {
			if( slider_id == null || slider_id == undefined ) {
				if( typeof jQuery(this).find('.zozo-circle-counter.circle-no-slider').data('owlCarousel') != 'undefined' ) {
					jQuery(this).find('.zozo-circle-counter.circle-no-slider').data('owlCarousel').destroy();
					jQuery(this).find('.zozo-circle-counter.circle-no-slider').removeClass('owl-carousel');
				}
			}
		}
	
	});
}


/* ======================== Circle Counter ======================== */

var rart = rart || {};
	
var isMobile = function() {
	var check = false;
	(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function zozo_initCircleCounter(barcolor) {	
	
	function zozo_Piechart(target, barcolor){
		if(target === undefined) {
			target = jQuery('.zozo-piechart');
		}
		
		if( target.length != 0 && jQuery().easyPieChart ) {
			
			if(barcolor === undefined) {
				var barcolor = target.data('barcolor');
			}
			
			var trackcolor = target.data('trackcolor');
			if(trackcolor === undefined) {
				var trackcolor = false;
			}
			
			var size = target.parents('.zozo-circle-counter').data('circle');
			if(size === undefined) {
				var size = 152;
			}
			var linewidth = target.parents('.zozo-circle-counter').data('linewidth');
			if(linewidth === undefined) {
				var linewidth = 6;
			}
			
			target.easyPieChart({
				animate: 3000,
				barColor: barcolor,
				trackColor: trackcolor,
				easing: 'easeOutBounce',
				size: size,
				lineWidth: linewidth,
				lineCap: 'round', // rectAngle or round
				scaleColor: false,
				onStep: function(from, to, percent) {
					jQuery(this.el).find('span').text(Math.round(percent));
				}
			});
		}	
	}
	
	if( !isMobile() && jQuery().appear )
	{
		jQuery('.zozo-piechart').appear(function() {
			zozo_Piechart(jQuery(this), barcolor);
		});
	}
	else{
		jQuery('.zozo-piechart').appear(function() {
			zozo_Piechart(jQuery(this), barcolor, '');
		});
	}	
}
	
/* ======================== Google Map ======================== */
window.onload = MapLoadScript;
var google;
function GmapInit() {
	  Gmap = jQuery('.gmap_canvas');
	  Gmap.each(function() {		
		var $this           = jQuery(this),
			zoom            = 12,
			scrollwheel     = false,
			zoomcontrol 	= true,
			draggable       = true,
			mapType         = google.maps.MapTypeId.ROADMAP,
			title           = '',
			contentString   = '',
			dataAddress     = $this.data('address'),
			dataZoom        = $this.data('zoom'),
			dataType        = $this.data('type'),
			dataScrollwheel = $this.data('scrollwheel'),
			dataZoomcontrol = $this.data('zoomcontrol'),
			dataHue         = $this.data('hue'),
			dataSaturation  = $this.data('saturation'),
			dataLightness   = $this.data('lightness');
			
		var latlngArray = dataAddress.split(',');
		var lat = parseFloat(latlngArray[0]);
		var lng = parseFloat(latlngArray[1]);
				
		if( dataZoom !== undefined && dataZoom !== false ) {
			zoom = parseFloat(dataZoom);
		}
		if( dataScrollwheel !== undefined && dataScrollwheel !== null ) {
			scrollwheel = dataScrollwheel;
		}
		if( dataZoomcontrol !== undefined && dataZoomcontrol !== null ) {
			zoomcontrol = dataZoomcontrol;
		}
		if( dataType !== undefined && dataType !== false ) {
			if( dataType == 'satellite' ) {
				mapType = google.maps.MapTypeId.SATELLITE;
			} else if( dataType == 'hybrid' ) {
				mapType = google.maps.MapTypeId.HYBRID;
			} else if( dataType == 'terrain' ) {
				mapType = google.maps.MapTypeId.TERRAIN;
			}		  	
		}
		
		if( navigator.userAgent.match(/iPad|iPhone|Android/i) ) {
			draggable = false;
		}
		
		var mapOptions = {
		  zoom        : zoom,
		  scrollwheel : scrollwheel,
		  zoomControl : zoomcontrol,
		  draggable   : draggable,
		  center      : new google.maps.LatLng(lat, lng),
		  mapTypeId   : mapType
		};		
		var map = new google.maps.Map($this[0], mapOptions);
		
		var image = $this.data('marker');
		
		var contents    = $this.data('content');
		var titles 		= $this.data('title');
		
		if( ( contents !== undefined && contents !== false ) || ( titles !== undefined && titles !== false ) ) {
			var contentArray = contents.split('|');
			var titleArray   = titles.split(',');
		}
		
		var addresses    = $this.data('addresses');
		if( addresses !== undefined && addresses !== '' ) {
			var addressArray = addresses.split('|');
			var address = [];
			
			for (var i = 0; i < addressArray.length; i++) {
				address[i] = addressArray[i];
				var latlngArray = address[i].split(',');
				var lat1 = parseFloat(latlngArray[0]);
				var lng1 = parseFloat(latlngArray[1]);
				
				var marker = new google.maps.Marker({
				  position : new google.maps.LatLng(lat1, lng1),
				  map      : map,
				  icon     : image,
				  title    : titleArray[i],
				});
				
				if( contents !== undefined && contents !== '' ) {
					marker.content = '<div class="map-data">';
					marker.content += '<h6>' + titleArray[i] + '</h6>';
					marker.content += '<div class="map-content">';
					var contentNew = contentArray[i].split(',');
					
					for (var j = 0; j < contentNew.length; j++) {
						if( j == 0 ) {
							marker.content += contentNew[j];
						} else {
							marker.content += '<br>' + contentNew[j];
						}
					}
					marker.content += '</div>' + '</div>';
					
					marker.info = new google.maps.InfoWindow();
					google.maps.event.addListener(marker, 'click', function() {
						marker.info.setContent(this.content);
						marker.info.open(this.getMap(), this);
					});
				}
			}
		} else {
			var marker = new google.maps.Marker({
			  position : new google.maps.LatLng(lat, lng),
			  map      : map,
			  icon     : image,
			});
			
			if( contents !== undefined && contents !== '' ) {
				marker.content = '<div class="map-data">' + '<h6>' + titles + '</h6>' + '<div class="map-content">' + contents + '</div>' + '</div>';
			}
			var d_infowindow = new google.maps.InfoWindow();
			
			if( contents !== undefined && contents !== '' ) {
				google.maps.event.addListener(marker, 'click', function() {
					d_infowindow.setContent(this.content);
					d_infowindow.open(this.getMap(), this);
				});
			}
		}
		
		if( dataHue !== undefined && dataHue !== '' ) {
		  var styles = [
			{
			  stylers : [
				{ hue : dataHue },
				{ saturation: dataSaturation },
				{ lightness: dataLightness }
			  ]
			}
		  ];
		  map.setOptions({styles: styles});
		}
	 });	 
}

function MapLoadScript() {
	if( typeof google !== 'undefined' && typeof google === 'object' ) {
		if( typeof google.maps === 'object' ) {
			GmapInit();
		}
	}
}