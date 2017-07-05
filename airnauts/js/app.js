var $window, root, scrollTop,
	loadedAssetsCounter = 0,
	wiperSF = 20,
	tabletWidth = 1024,
	tabletSmallWidth = 800,
	smallScreenWidth = 600;

/* Core
   ========================================================================== */

var Core = {

	init: function() {

		$window = $(window);
		root = $('html, body');
		$window.on('ready scroll', function() {
			scrollTop = $window.scrollTop();
		});

		// detect android
		var ua = navigator.userAgent.toLowerCase(),
			isAndroid = ua.indexOf('android') > -1;
		if (isAndroid) $('html').addClass('device-android');

		jQuery.extend(jQuery.easing, {
			easeOutCubic: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			}
		});
	}
};

/* Content Enhancements
   ========================================================================== */

var ContentEnhancements = {

	encryptEmails: function() {
		$('a.email').each(function() {
			var address = $(this).text();
			address = address.replace('()', '@').replace(/--/g, '.');
			$(this).attr('href','mailto:' + address);
			$(this).text(address);
		});
	},

	initServiceList: function() {
		$('.service-list li').each(function() {
			var svg = $(this).find('svg'),
				c = svg.attr('class');
			svg.add(svg.prev('b')).wrapAll('<span class="small-icon-wrap"/>');
			svg.clone().attr('class', c+' big').insertAfter(svg.parent()).wrap('<span class="big-icon-wrap"/>');
			svg.attr('class', c+' small');
		});
	},

	initClientQuotes: function() {

		var clientList = $('.client-list'),
			quotesWrapper = $('<div class="quotes-wrapper"/>');

		quotesWrapper.insertBefore(clientList);
		quotesWrapper.append('<div class="quotes"/>');
		clientList.children().each(function() {
			$(this).find('.quote').appendTo(quotesWrapper.find('.quotes'));
		}).on('mouseenter touchend', function(e) {
			var event = e.type;
			if (!Modernizr.touch && event == 'mouseenter' || Modernizr.touch && event == 'touchend') {

				index = $(this).index();
				var incomingQuote = quotesWrapper.find('.quote').eq(index);

				if (parseInt(incomingQuote.css('top')) != 0) {

					TweenMax.fromTo(incomingQuote, 0.35, { opacity: 0, top: 100 }, { opacity: 1, top: 0 });
					TweenMax.to(incomingQuote.siblings(), 0.35, { opacity: 0, top: -70 });

					$(this).addClass('hover').siblings().removeClass('hover');

				}

			}

		});

		clientList.children().first().addClass('hover');
		quotesWrapper.find('.quote').first().css({
			opacity: 1,
			top: 0
		});
	},

	init: function() {
		this.encryptEmails();
		this.initServiceList();
		this.initClientQuotes();
	}
};

/* Header
   ========================================================================== */

var Header = {

	el: $('.page-header'),
	switcherEl: $('.menu-switcher'),

	init: function() {

		// load icon
		this.el.find('.logo i').load('img/logo-shape.svg');
		this.switcherEl.find('i').append('<em/>');

		// adjust header position
		$window.on('ready load scroll resize', function() {
			if (scrollTop >= ContentSections.offsetTop) {
				if (!Modernizr.touch && window.innerWidth > tabletWidth) {
					Header.el.addClass('fixed');
				} else {
					Header.el.addClass('visible');
				}
			} else {
				if (!Modernizr.touch && window.innerWidth > tabletWidth) {
					Header.el.removeClass('fixed');
				} else {
					Header.el.removeClass('visible');
				}
			}

			if (!Modernizr.touch) {
				if (scrollTop >= ContentSections.offsetTop - window.innerHeight / 2) {
					if (Header.el.hasClass('w-labels')) {
						Header.el.removeClass('w-labels');
					}
				} else {
					if (!Header.el.hasClass('w-labels')) {
						Header.el.addClass('w-labels');
					}
				}
			}
		});

		this.el.find('.logo').click(function(e) {
			root.animate({
				scrollTop: 0
			}, scrollTop/5, 'easeOutCubic');
			e.preventDefault();
		});

		this.switcherEl.click(function(e) {
			if (Menu.isOpen()) {
				Menu.close();
			} else {
				Menu.open();
			}
			e.preventDefault();
		});
	}
};

/* Footer
   ========================================================================== */

var Footer = {

	el: $('.page-footer'),

	widgets: {

		spotify: {

			el: $('.footer-section.spotify'),
			init: function() {

				var spotifyEl = Footer.widgets.spotify.el;

				$.getJSON('http://airnauts.com/widgets-airnauts/spotify/spotify.php?callback=?', function(data) {
					if (data.hasOwnProperty('result')) {
						var songsCount = data.result[0][0].songsCount,
							songsDuration = data.result[0][0].songsDuration,
							playlistCount = data.result[0][0].playlistCount,
							top3 = data.result[0][0].popular.slice(0, 3);
							nowPlaying = data.result[1][0];

						spotifyEl.find('.stat.songs b').text(songsCount);
						spotifyEl.find('.stat.hours b').text(parseInt(songsDuration/3600));
						spotifyEl.find('.stat.playlists b').text(playlistCount);

						var top3ul = $('<ul/>');
						$.each(top3, function(key, val) {
							top3ul.append('<li><a href="'+val.trackUrl+'" target="_blank"><img src="'+val.imageUrl+'" alt=""> <b>'+val.track+'</b> - '+val.artists+'</a></li>');
						});
						top3ul.appendTo(spotifyEl.find('.top-n'));

						nowPlayingEl = $('<div class="inner"><a href="'+nowPlaying.trackUrl+'" target="_blank"><img src="'+nowPlaying.imageUrl+'" alt=""></a><h3>'+nowPlaying.artists+'</h3><h4><a href="'+nowPlaying.trackUrl+'">'+nowPlaying.track+'</a></h4></div>');
						nowPlayingEl.appendTo(spotifyEl.find('.playing'));

						IntroSection.updateBodySize();
					}
				});
			}
		},

		instagram: {

			init: function() {

        $('.instagram .photo-stream').instaShow({
          api: 'http://airnauts.com/homepage_fresh/api/instagram/index.php',
          source: '#airnauts',
          filterExcept: '#eadc',
          width: 'auto',
          height: '150px',
          columns: 20,
          rows: 1,
          popupInfo: '',
          arrowsControl: false,
          scrollControl: false,
          dragControl: false,
          scrollbar: false,
          loop: false,
          mode: 'instagram',
          info: {}
        });
			}
		},

		twitter: {

			el: $('.footer-section.twitter'),
			firstItemRevealed: false,

			init: function() {

				$.getJSON('http://airnauts.com/widgets-airnauts/twitter/feed.php?callback=?', function(data) {

					var items = [];
					$.each(data, function(key, val) {
						items.push('<li'+(key == 0 ? ' class="first-item"' : '')+'><p class="message"><a href="https://twitter.com/'+val.author+'/status/'+val.id+'"  target="_blank">'+val.tweet+'</a></p><p class="author '+val.author.toLowerCase()+'"><a href="https://twitter.com/'+val.author+'" target="_blank"><img src="'+val.avatar+'" alt=""> <span>@'+val.author+'</span></a></p></li>');
					});

					$('<ul/>', {
						'class': 'twitter-feed',
						html: items.join('')
					}).appendTo(Footer.widgets.twitter.el.children('.content'));

					// equalize paragraphs
					var h = 0;
					Footer.widgets.twitter.el.find('.message').each(function() {
						var ch = $(this).height();
						h = ch > h ? ch : h;
					}).css({ minHeight: h });

					IntroSection.updateBodySize();

					Footer.widgets.initEffects();

				});
			}
		},

		showNewItem: function(widgetName) {
			var content = Footer.el.find('.footer-section.'+widgetName+' .content');
			content.addClass('new-item-revealed');

			if (widgetName == 'instagram') {
				Footer.widgets.instagram.firstItemRevealed = true;
			} else if (widgetName == 'twitter') {
				Footer.widgets.twitter.firstItemRevealed = true;
			}
		},

		initEffects: function() {
			var widgets = $('.footer-section'),
				bHeight = $('body').height(),
				fHeight = Footer.el.outerHeight(),
				pos = [],
				heights = [];

			widgets.each(function(i) {
				heights[i] = $(this).outerHeight();
			});

			pos[2] = bHeight - fHeight - window.innerHeight;
			pos[1] = pos[2] + heights[2] + parseInt(widgets.eq(1).css('margin-bottom'));
			pos[0] = pos[1] + heights[1] + parseInt(widgets.eq(0).css('margin-bottom'));

			// show footer sections when available in viewport
			if (!Modernizr.touch && window.innerWidth > tabletWidth) {
				var footerSM = new ScrollMagic(),
					so = 50,
					ws0 = new ScrollScene({ offset: pos[0] + so, duration: heights[0] + so })
					.setTween(TweenMax.fromTo(widgets.eq(0), 0.5, { alpha: 0 }, { alpha: 1 }));
					ws1 = new ScrollScene({ offset: pos[1] + so, duration: heights[1] + so })
					.setTween(TweenMax.fromTo(widgets.eq(1), 0.5, { alpha: 0 }, { alpha: 1 }));
					ws2 = new ScrollScene({ offset: pos[2] + so, duration: heights[2] + so })
					.setTween(TweenMax.fromTo(widgets.eq(2), 0.5, { alpha: 0 }, { alpha: 1 }));
				footerSM.addScene([ws0, ws1, ws2]);

				$window.on('scroll', function() {
					if (scrollTop > pos[1]) { // twitter widget fully visible
						if (!Footer.widgets.twitter.firstItemRevealed) {
							setTimeout(function() {
								Footer.widgets.showNewItem('twitter');
							}, 3000);
							Footer.widgets.twitter.firstItemRevealed = true;
						}

						if (scrollTop > pos[0]) { // spotify widget fully visible
							if (!Footer.widgets.instagram.firstItemRevealed) {
								setTimeout(function() {
									Footer.widgets.showNewItem('instagram');
								}, 8000);
								Footer.widgets.instagram.firstItemRevealed = true;
							}
						}
					}
				});

        for (var i = 0; i < 10; i++) {
          setTimeout(function() {
            $window.trigger('scroll');
          }, i * 500);
        }
			}
		},

		init: function() {
			// this.spotify.init();
			this.instagram.init();
			this.twitter.init();
		}
	},

	init: function() {

		// load icons
		this.el.find('.heading').each(function() {
			var icon = $(this).data('icon');
			$(this).load('img/logo-'+icon+'.svg');
		});

		// load widgets
		this.widgets.init();
	}
};

/* Menu
   ========================================================================== */

var Menu = {

	el: $('.main-menu'),

	open: function() {

		//if (NavEnhancements.currentSlideIndex == 2) {
		if (scrollTop < ContentSections.offsetTop) {
			NavEnhancements.goTo(3);
			timeout = 750;
		} else {
			timeout = 0;
		}

		setTimeout($.proxy(function() {
			this.el.addClass('visible');
			Header.switcherEl.addClass('menu-open');

			var t = 100;
			this.el.find('nav li').removeClass('no-transition').each(function() {
				var li = $(this);
				setTimeout(function() {
					li.addClass('visible');
				}, t);
				t += 90;
			});

			this.updateCurrentNavItem();
			this.restoreMarkCurrentPosition();
		}, this), timeout);

	},

	close: function() {
		this.el.removeClass('visible');
		Header.switcherEl.removeClass('menu-open');

		Menu.el.find('nav li').addClass('no-transition');
		setTimeout(function() {
			Menu.el.find('nav li').removeClass('visible');
		}, 100);
	},

	isOpen: function() {
		return this.el.hasClass('visible');
	},

	restoreMarkCurrentPosition: function() {
		var top = this.el.find('li.current a').position().top;
		this.markCurrentEl.css({ top: top });
	},

	updateCurrentNavItem: function() {
		var nav = this.el.find('nav');
		nav.find('li').removeClass('current');
		var cur;
		if (ContentSections.inViewport()) {
			var visibleSectionIndex = Math.round((scrollTop - ContentSections.offsetTop) / window.innerHeight);
			cur = nav.find('li').eq(visibleSectionIndex + 1);
		} else if (scrollTop < ContentSections.offsetTop) {
			cur = nav.find('li').first();
		} else {
			cur = nav.find('ul + ul li').first();
		}
		cur.addClass('current');
	},

	init: function() {

		// load icons
		this.markCurrentEl = $('<i class="mark-current"/>');
		this.markCurrentEl.load('img/logo-shape.svg').appendTo(this.el.find('nav'));

		// add keyboard support
		$window.on('keyup', function(e) {
			var key = e.charCode || e.keyCode || 0;
			if (key == 27) { // esc
				if (Menu.isOpen()) {
					Menu.close();
				}
			}
		});

		// move the logo to stick with the hovered nav item
		var timeout;
		Menu.el.find('li a').hover(function() {
			var top = $(this).position().top;
			Menu.markCurrentEl.css({ top: top });
			clearTimeout(timeout);
		}, function() {
			timeout = setTimeout(function() {
				if (!Menu.el.find('li a:hover').length) {
					Menu.restoreMarkCurrentPosition();
				}
			}, 500);
		});

		this.el.children('nav').on('click', 'a', function(e) {
			var slide = $(this).data('slide');

			if (slide == 0) {
				Header.el.find('.logo').trigger('click');
			} else {
				NavEnhancements.goTo(slide);
			}

			Menu.close();
			e.preventDefault();
		});
	}
};

/* Intro Section
   ========================================================================== */

var IntroSection = {

	el: $('.section-intro'),
	assetsLoaded: 0,

	wiper: {

		el: $('#wiper'),
		stageEl: $('#wiper g'),
		sectorEl: $('#wiper path'),
		lastStopEl: $('#wiper stop:last'),

		draw: function(start, teta) {

			var start_deg = start,
				teta_deg = parseFloat(teta, 10),
				radius = 50,
				large_arc_flag = 0,
				sweep_flag = 0,
				digits = 2,
				start_rad, teta_rad, x, y, pointA, pointB, arc;

			if (teta_deg >= 360) { teta_deg = 359.99; }
			if (teta_deg <= -360) { teta_deg = -359.99; }

			start_rad = start_deg * Math.PI/180;
			teta_rad = teta_deg * Math.PI/180;

			x = Math.cos(start_rad) * radius;
			y = Math.sin(start_rad) * radius;
			pointA = [x+50, 50-y];
			x = Math.cos(start_rad+teta_rad) * radius;
			y = Math.sin(start_rad+teta_rad) * radius;
			pointB = [x+50, 50-y];

			if (teta_deg > 180) { large_arc_flag = 1; }
			if (teta_deg < 0) { large_arc_flag = 0; sweep_flag = 1; }
			if (teta_deg < -180) { large_arc_flag = 1; sweep_flag = 1; }
			arc = 'M 50 50 '
				+'L '+pointA[0].toFixed(digits)+' '+pointA[1].toFixed(digits)+' '
				+'A 50 50 '+start_rad.toFixed(digits)+' '
				+ large_arc_flag+' '+sweep_flag+' '
				+ pointB[0].toFixed(digits)+' '+pointB[1].toFixed(digits)+' '
				+'Z';

			this.sectorEl.attr('d', arc);
		},

		updateSize: function() {
			var ww = window.innerWidth,
				wh = window.innerHeight,
				newDiameter = Math.max(ww,wh) * 2.3,
				newTop = - (newDiameter - wh) / 2 - wh / 2 - 1,
				newLeft = - (newDiameter - ww) / 2,
				minScale = newDiameter / 100;

			if (window.innerWidth <= 400) { // mobile portrait
				newDiameter = Math.max(ww,wh) * 3;
				newLeft = - (newDiameter - ww * 2) / 2;
				newTop = - newDiameter / 2;
				minScale = newDiameter / 100;
			}

			this.el.css({
				width: newDiameter,
				height: newDiameter,
				top: newTop,
				left: newLeft
			});

			// update gradient color position
			var lastStopOffset = (newDiameter - (newDiameter - wh * 2) / 2) / newDiameter * 100;
			this.lastStopEl.attr('offset', lastStopOffset.toFixed(2)+'%');

			// update scale
			this.stageEl.attr('transform', 'scale('+minScale+') '+'translate(0,0)');
		}
	},

	updateBodySize: function() {
		if (!Modernizr.touch) {
			var height = '';
			if (window.innerWidth > tabletWidth) {
				height = ContentSections.offsetTop + (window.innerHeight * (ContentSections.el.children('.section').length - 1)) + $('.section-work').height() + Footer.el.outerHeight();
			}
			$('body').css({ height: height });
		}
	},

	keywordRotator: {

		el: $('.keyword-rotator'),
		keywords: [],

		play: function() {
			var rotator = this;
			var play = function() {
				var curSet = rotator.el.data('keyword-set'),
					nextSet = curSet < 2 ? curSet + 1 : 0;
				rotator.el.children('[data-alt]').each(function(i) {
					var t = i == 0 ? 0 : 250;
					var line = $(this);
					setTimeout(function() {
						line.children().eq(curSet).addClass('outgoing');
						setTimeout(function() {
							line.children().eq(nextSet).addClass('active');
						}, 750);
						setTimeout(function() {
							line.children().eq(curSet).attr('class', '');
						}, 750);
					}, t);
				});
				rotator.el.data('keyword-set', nextSet);
			}
			play();
			setTimeout(play, 3000);
		},

		init: function() {
			var keywords = this.keywords;

			this.el.find('span[data-alt]').each(function() {
				var line = $(this);
				var a = [];
				a.push(line.text());
				var alt = line.data('alt').split(', ');
				a[1] = alt[0];
				a[2] = alt[1];
				keywords.push(a);
				line.wrapInner('<em class="active">');
				for (var i = 1; i < a.length; i++) {
					line.append('<em>'+a[i]+'</em>');
				}
			});

			this.el.data('keyword-set', 0);
		}
	},

	scrollIndRotator: {

		el: $('.scroll-ind'),

		play: function() {

			var line = this.el.children().first();
			var play = function() {
				line.addClass('transition')
					.wait(10).addClass('outgoing')
					.wait(750+100).removeClass('transition')
					.wait(10).addClass('incoming')
					.wait(10).removeClass('outgoing')
					.wait(10).addClass('transition')
					.wait(10).removeClass('incoming');
			}
			play();
			setInterval(play, 3000);
		}
	},

	startAnimation: function() {
		IntroSection.el.find('.bg').addClass('init');
		$({ value: 180 }).animate({ value: 240 }, {
			duration: 1000,
			step: function() {
				IntroSection.wiper.draw(0, this.value);
			},
			easing: 'easeOutCubic',
			complete: function() {
				$('.logo-main').addClass('init');
				setTimeout(function() {
					IntroSection.keywordRotator.el.addClass('init');
					IntroSection.keywordRotator.play();
					setTimeout(function() {
						if (window.innerWidth > tabletWidth) {
							$('.scroll-ind').addClass('init');
							setTimeout(function() {
								IntroSection.scrollIndRotator.play();
							}, 3000);
						} else {
							IntroSection.touchDevAnimation.play();
						}
					}, 2500);
				}, 1000);
				IntroSection.startAnimationDone = true;
			}
		});
	},

	touchDevAnimation: {

		animStep1: function() {
			$({ value: 240 }).animate({ value: 359.9 }, {
				duration: 1500,
				step: function() {
					IntroSection.wiper.draw(0, this.value);
				}
			});

			TweenMax.to('.section-intro .slide-1, .logo-main', 1.5, { alpha: 0 });
			TweenMax.to('.section-intro .slide-2', 1.5, { alpha: 1, visibility: 'visible', delay: .75 });

			setTimeout(function() {
				IntroSection.el.addClass('reversed');
				$('.logo-main').hide();
			}, 1510);
		},

		animStep2: function() {

			$({ value: 359.9 }).animate({ value: 180 }, {
				duration: 1800,
				step: function() {
					IntroSection.wiper.draw(0, this.value);
				}
			});

			TweenMax.to('.section-intro .slide-2', 1.5, { alpha: 0 });
			TweenMax.to('.section-intro .slide-3', 1.5, { alpha: 1, visibility: 'visible', delay: .75 });
		},

		animStep3: function() {
			if (scrollTop < window.innerHeight) {
				NavEnhancements.goTo(3);

				// show first slide again
				setTimeout(function() {
					IntroSection.el.removeClass('reversed');
					IntroSection.wiper.draw(0, 240);
					TweenMax.to('.section-intro .slide-1, .logo-main', .01, { alpha: 1, visibility: 'visible' });
					TweenMax.to('.section-intro .slide-3', .01, { alpha: 0 });
					$('.logo-main').show();
				}, 750+100);
			}
		},

		play: function() {

			var t = this;
			this.animStep1();

			setTimeout(function() {
				t.animStep2();

				setTimeout(function() {
					t.animStep3();
				}, 4000);
			}, 4000);
		}
	},

	init: function() {

		// load logo and background image
		var i1 = $('<span class="i1">'),
			i2 = $('<span class="i2">');
			mainLogo = $('.logo-main');
		var incrementAssetsCounter = function() {
			IntroSection.assetsLoaded++;
		}
		i1.load('img/logo-text.svg', function() {
			mainLogo.append(i1);
			incrementAssetsCounter();
			updateLoadedAssetsCounter('logo part 1');
		});
		i2.load('img/logo-shape.svg', function() {
			mainLogo.append(i2);
			incrementAssetsCounter();
			updateLoadedAssetsCounter('logo part 2');
		});

		// load video bg
		if (!Modernizr.touch && window.innerWidth > tabletWidth) { // desktop
			var BV = new $.BigVideo({
				container: $('.video-bg'),
				useFlashForFirefox: false
			});
			BV.init();
			BV.show('video/video.mp4', {
				ambient: true,
				altSource: 'video/video.webm'
			});
			BV.getPlayer().on('loadedmetadata', function() {
				incrementAssetsCounter();
				updateLoadedAssetsCounter('video meta data');
			});
			BV.getPlayer().on('loadeddata', function() {
				updateLoadedAssetsCounter('video data');
			});
		} else { // mobile
			var bgImgPath = 'img/bg-intro.gif';
			$('<img/>').attr({ src: bgImgPath }).on('load', function() {
				$(this).remove();
				IntroSection.el.find('.bg').css({ backgroundImage: 'url('+bgImgPath+')' });
				incrementAssetsCounter();
				updateLoadedAssetsCounter('intro bg image');
			});
		}

		$window.on('ready load resize', function() {
			IntroSection.wiper.updateSize();
			IntroSection.wiper.el.css({ display: 'block' });
			IntroSection.updateBodySize();
		});

		this.keywordRotator.init();

		IntroSection.wiper.draw(0, 180);

		var videoPaused = false;

		$window.on('ready scroll', function() {
			if (IntroSection.startAnimationDone) {

				if (!Modernizr.touch && window.innerWidth > tabletWidth) { // desktop
					var scrollFactor = scrollTop / wiperSF;
					if (scrollFactor <= 120) {
						IntroSection.wiper.draw(0, Math.min(240 + scrollFactor, 360));
						if (IntroSection.el.hasClass('reversed')) {
							IntroSection.el.removeClass('reversed');
						}
					} else if (scrollFactor > 120 && scrollFactor < 999) {
						if (!IntroSection.el.hasClass('reversed')) {
							IntroSection.el.addClass('reversed');
						}
						var t = Math.max(360 - (scrollFactor - 120), 180);
						IntroSection.wiper.draw(0, t);
					}

					// update current slide index
					if (scrollFactor <= 120) {
						NavEnhancements.currentSlideIndex = 0;
					} else if (scrollFactor <= 300) {
						NavEnhancements.currentSlideIndex = 1;
					} else if (scrollFactor <= 360) {
						NavEnhancements.currentSlideIndex = 2;
						if (ContentSections.inViewport()) {
							NavEnhancements.currentSlideIndex = 3;
						}
					} else {
						if (ContentSections.inViewport()) {
							var visibleSectionIndex = Math.round((scrollTop - ContentSections.offsetTop) / window.innerHeight);
							NavEnhancements.currentSlideIndex = visibleSectionIndex + 3;
						}
					}
				}

				// put the intro below the footer
				if (!Modernizr.touch & window.innerWidth > tabletWidth) {
					if (scrollTop > ContentSections.offsetTop) {
						if (!IntroSection.el.hasClass('below-footer')) {
							IntroSection.el.addClass('below-footer');
						}
					} else {
						if (IntroSection.el.hasClass('below-footer')) {
							IntroSection.el.removeClass('below-footer');
						}
					}

					// hide intro section and pause video bg
					var csHeight = window.innerHeight * ContentSections.el.children('.section').length;
					var isSafari = /constructor/i.test(window.HTMLElement);
					if (scrollTop > ContentSections.offsetTop && scrollTop < ContentSections.offsetTop + csHeight - window.innerHeight) {
						if (!videoPaused || !IntroSection.el.hasClass('hidden')) {
							BV.getPlayer().pause();
							IntroSection.el.addClass('hidden');
							videoPaused = true;
							if (isSafari && !Footer.el.hasClass('sffix')) {
								Footer.el.addClass('sffix');
							}
						}
					} else {
						if (videoPaused || IntroSection.el.hasClass('hidden')) {
							BV.getPlayer().play();
							IntroSection.el.removeClass('hidden');
							videoPaused = false;
							if (isSafari && Footer.el.hasClass('sffix')) {
								Footer.el.removeClass('sffix');
							}
						}
					}

				}

			}
		});

		var wrap = $('.section-intro .wrap');
		$window.on('scroll', function() {
			if (scrollTop < window.innerHeight) {
				if (parseInt(wrap.css('opacity')) == 0) {
					wrap.css('opacity', 1);
				}
			}
		}, 100);


		// update size
		$window.on('ready resize', function() {
			IntroSection.el.height(window.innerHeight);
		});

		// on scroll animations

		if (!Modernizr.touch && window.innerWidth > tabletWidth) { // desktop

			var controller = new ScrollMagic();
			var scrollFactor = wiperSF;

			var scene1 = new ScrollScene({ offset: scrollFactor * 10, duration: scrollFactor * 90 })
				.setTween(TweenMax.to('.section-intro .slide-1, .logo-main', 0.5, { alpha: 0 }));

			var scene2 = new ScrollScene({ offset: scrollFactor * 80, duration: scrollFactor * 60 })
				.setTween(TweenMax.to('.section-intro .slide-2', 0.5, { alpha: 1, visibility: 'visible', y: 0 }));

			var scene3 = new ScrollScene({ offset: scrollFactor * 140, duration: scrollFactor * 60 })
				.setTween(TweenMax.to('.section-intro .slide-2', 0.5, { alpha: 0 }));

			var scene4 = new ScrollScene({ offset: scrollFactor * 205, duration: scrollFactor * 150 })
				.setTween(TweenMax.to('.section-intro .slide-3', 0.5, { alpha: 1, visibility: 'visible', y: 0 }));

			var scene5 = new ScrollScene({ offset: ContentSections.offsetTop - window.innerHeight, duration: window.innerHeight })
				.setTween(TweenMax.to('.section-intro .wrap', 0.5, { alpha: 0 }));

			var scene6 = new ScrollScene({ offset: ContentSections.offsetTop, duration: 100 })
				.setTween(TweenMax.to('.section-intro .wrap', 0.5, { alpha: 1 }));

			controller.addScene([
				scene1,
				scene2,
				scene3,
				scene4,
				scene5,
				scene6
			]);

			var slide3 = $('.section-intro .slide-3');
			$window.on('scroll', function() {
				if (scrollTop > ContentSections.offsetTop) {
					slide3.hide();
				} else {
					slide3.show();
				}
			});
		}

		$window.trigger('resize');

	},

	play: function() {
		setTimeout(function() {
			IntroSection.startAnimation();
		}, Modernizr.touch ? 1 : 1);
	}
};

/* Content Sections
   ========================================================================== */

var ContentSections = {

	el: $('.content-sections'),
	sections: $('.content-sections .section'),

	inViewport: function() {
		var csHeight = window.innerHeight * this.el.children('.section').length,
			result = scrollTop + window.innerHeight/2 > this.offsetTop && scrollTop - 150 < this.offsetTop + csHeight - window.innerHeight;
		return result;
	},

	updateSectionsHeight: function() {
		if (window.innerWidth > tabletWidth) {
			this.sections.height(window.innerHeight);
		} else {
			this.sections.css({ height: '' });
		}
	},

	afterSnap: function(contentSectionIndex) {

		NavEnhancements.currentSlideIndex = contentSectionIndex + 3;

		if (contentSectionIndex == 3) { // contact
			//
		}

	},

	init: function() {

		if (window.innerWidth > tabletWidth) {
			this.offsetTop = wiperSF * 300 + window.innerHeight;
		} else {
			this.offsetTop = window.innerHeight;
		}

		this.el.css({ top: this.offsetTop });

		this.updateSectionsHeight();
		$window.on('resize', $.proxy(this.updateSectionsHeight, this));

		/*
		// snap to section
		if (!Modernizr.touch) {

			var allowUserScroll = true;

			$window.on('mousewheel', function(e) {
				if (!allowUserScroll) {
					e.preventDefault();
				}
			});

			$window.on('scroll resize', function(e) {
				if (window.innerWidth > tabletWidth) {
					if (ContentSections.inViewport()) {
						var visibleSectionIndex = Math.round((scrollTop - ContentSections.offsetTop) / window.innerHeight);
							visibleSectionTop = ContentSections.el.children().eq(visibleSectionIndex).offset().top;
						allowUserScroll = false;
						root.stop();
						root.animate({
							scrollTop: visibleSectionTop
						}, 500, 'easeOutCubic', function() {
							ContentSections.afterSnap(visibleSectionIndex);
							allowUserScroll = true;
						});
					}
				}
			}, 750);
		}
		*/
	}
};

/* Work
   ========================================================================== */

var Work = {

	details: {

		el: $('.work-details'),
		frameEl: $('.work-details .frame'),
		navEl: $('.work-details .nav'),
		itemsWrapperEl: $('.work-details .items-wrapper'),
		itemsEl: $('.work-details .items'),

		getCurProjectEl: function() {
			return this.el.find('.item.visible').first();
		},

		getCurProjectName: function() {
			return $.trim(this.getCurProjectEl().attr('class').replace('item', '').replace('visible', ''));
		},

		buildSlider: function() {

			if (!Modernizr.touch) {
				//this.itemsWrapper
				var itemCount = this.itemsEl.children().length;
				this.itemsEl.width(itemCount + '00%').children().width(100/itemCount + '%');
			}

			// swipe effect
			if (Modernizr.touch) {
				this.itemsWrapperEl.children('.shadow').remove();
				this.itemsWrapperEl.addClass('swipe').removeClass('items-wrapper');
				this.itemsWrapperEl.children('.items').addClass('swipe-wrap').removeClass('items');
				window.workSwipe = this.itemsWrapperEl.Swipe({
					continuous: false,
					callback: function(e) {
						Work.details.itemsEl.children().eq(e).addClass('visible').siblings().removeClass('visible');
					}
				}).data('Swipe');
				this.itemsWrapperEl.css('visibility', '');
			}
		},

		show: function(projectName) {

			var projectTitle = $.trim($('.work-list .'+projectName+' a').text()),
				tb = $('.work-list .'+projectName+' a'),
				//bgImg = this.el.find('.item.'+projectName).data('bg'),
				//fullBg = bgImg ? 'url(img/work/details/'+bgImg+')' : 'none',
				fullBg,
				frameOffsetTop = 100,
				//tbOffsetTop = tb.position().top;
				tbOffsetTop = tb.offset().top - scrollTop;

			if (window.innerWidth <= tabletWidth) {
				//fullBg = tb.find('.bg1').css('background-image');
				frameOffsetTop = 0;
				//tbOffsetTop = tb.offset().top - scrollTop;
			}

			$('body').addClass('work-details-mode');

			this.frameEl.css({
				width: tb.width(),
				height: tb.height(),
				top: tbOffsetTop,
				left: tb.position().left
			}).wait(1).addClass('transition').wait(1).css({
				width: window.innerWidth,
				height: window.innerHeight,
				top: frameOffsetTop,
				left: 0
			}).children('.bg').css({ /*backgroundImage: fullBg*/ }).wait(150).addClass('visible');

			// update size on resize
			$window.on('resize', function() {
				Work.details.frameEl.filter(':visible').css({
					width: window.innerWidth,
					height: window.innerHeight
				});
			});

			this.el.find('.item.'+projectName).wait(350).addClass('visible');

			if (!Modernizr.touch) {
				var xOffset = - this.itemsEl.children('.'+projectName).index() * $window.width();
				TweenMax.to(this.itemsEl, .01, { x: xOffset });
				if (!Modernizr.touch) TweenMax.to(this.itemsHelperEl, .01, { x: xOffset });
			} else {
				var ind = this.itemsEl.children('.'+projectName).index();
				workSwipe.slide(ind, 1);
			}

			this.itemsWrapperEl.wait(350).addClass('visible');
			if (!Modernizr.touch) this.itemsWrapperHelperEl.wait(350).addClass('visible');

			var titleIcon = tb.find('i').first().clone();
			titleIcon.find('img[src*="nowness"]').attr('src', 'img/work/logo-nowness.svg');
			this.navEl.find('.title').html('<div class="'+projectName+'">'+projectTitle+'</div>')
				.children().prepend(titleIcon);
			this.navEl.wait(150).addClass('visible');

			Header.el.wait(500).css('z-index', 1);

			// landscape mode bug fix
			if (window.innerWidth <= smallScreenWidth) {
				setInterval(function() {
					if (window.innerWidth > window.innerHeight && Work.details.isOpen()) {
						window.scrollTo(0, $('.work-list').offset().top);
					}
				}, 1000);
			}
		},

		hide: function() {

			var curProjectEl = this.getCurProjectEl(),
				curProjectName = this.getCurProjectName(),
				tb = $('.work-list .'+curProjectName+' a'),
				//tbOffsetTop = tb.position().top;
				tbOffsetTop = tb.offset().top - scrollTop;

			/*
			if (window.innerWidth <= tabletWidth) {
				tbOffsetTop = tb.offset().top - scrollTop;
			}
			*/

			this.frameEl.wait(100).css({
				width: tb.width(),
				height: tb.height(),
				top: tbOffsetTop,
				left: tb.position().left
			}).wait(250).css({
				visibility: 'hidden',
				opacity: 0
			}).wait(500).removeClass('transition').css({
				visibility: 'visible',
				opacity: 1,
				width: 0,
				height: 0,
				top: 0,
				left: 0
			});
			this.frameEl.children('.bg').wait(500).removeClass('visible');

			this.navEl.removeClass('visible');
			curProjectEl.removeClass('visible');
			this.itemsWrapperEl.removeClass('visible');
			if (!Modernizr.touch) this.itemsWrapperHelperEl.removeClass('visible');

			$('body').wait(50).removeClass('work-details-mode');

			Header.el.css('z-index', 7);
		},

		isOpen: function() {
			return $('body').hasClass('work-details-mode');
		},

		navigate: function(direction) {

			if (!this.itemsEl.hasClass('animated')) {

				var outgoingProjectEl = this.getCurProjectEl(),
					outgoingProjectName = this.getCurProjectName(),
					incomingProjectEl,
					incomingProjectName,
					incomingDirection,
					outgoingDirection,
					rubberBand;

				if (direction == 'next') {
					incomingDirection = 'right';
					outgoingDirection = 'left';
					incomingProjectEl = outgoingProjectEl.next();
					if (!incomingProjectEl.length) {
						rubberBand = 'last';
					}
				} else {
					incomingDirection = 'left';
					outgoingDirection = 'right';
					incomingProjectEl = outgoingProjectEl.prev()
					if (!incomingProjectEl.length) {
						rubberBand = 'first';
					}
				}

				if (rubberBand) {

					var xr1, xr2;
					if (rubberBand == 'first') {
						xr1 = 100;
						xr2 = 0;
					} else if (rubberBand == 'last') {
						var itemCount = this.itemsEl.children().length;
						xr1 = - $window.width() * (itemCount - 1) - 100;
						xr2 = - $window.width() * (itemCount - 1);
					}

					TweenMax.to(this.itemsEl, .3, { x: xr1, ease: Sine.easeOut });
					TweenMax.to(this.itemsEl, .8, { x: xr2, ease: Elastic.easeOut, delay: .1 });
					if (!Modernizr.touch) TweenMax.to(this.itemsHelperEl, .3, { x: xr1, ease: Sine.easeOut });
					if (!Modernizr.touch) TweenMax.to(this.itemsHelperEl, .8, { x: xr2, ease: Elastic.easeOut, delay: .1 });

				} else {

					if (!Modernizr.touch) {

						var xVal;
						if (direction == 'prev') {
							xVal = '+='+$window.width();
						} else if (direction == 'next') {
							xVal = '-='+$window.width();
						}

						incomingProjectName = $.trim(incomingProjectEl.attr('class').replace('item', '').replace('visible', ''));
						incomingProjectTitle = $.trim($('.work-list .'+incomingProjectName+' a').text());

						this.itemsEl.addClass('animated');
						var proj = this.itemsHelperEl.find('.item-helper.'+outgoingProjectName);
						var proj2 = this.itemsHelperEl.find('.item-helper.'+incomingProjectName);

						if (direction == 'next') {

							TweenMax.to(proj.find('.about, .featured-in'), .7, { x: -window.innerWidth/2, ease: Sine.easeOut });
							TweenMax.to(proj.find('.download-bar'), .7, { x: -window.innerWidth/2, ease: Sine.easeOut, delay: .05 });
							TweenMax.to(proj.find('.short-info'), .7, { x: -window.innerWidth/2, ease: Sine.easeOut, delay: .1 });
							setTimeout(function() {
								TweenMax.to(Work.details.itemsEl, .7, { x: xVal, ease: Sine.easeOut, onComplete: function() {
									Work.details.itemsEl.removeClass('animated');
									TweenMax.to(proj.find('.about, .featured-in, .download-bar, .short-info'), .01, { x: 0 });
								}});
								TweenMax.to(Work.details.itemsHelperEl, .7, { x: xVal, ease: Sine.easeOut });
							}, 100);

							TweenMax.fromTo(proj2.find('.about, .featured-in'), .7, { x: window.innerWidth/2 }, { x: 0, ease: Sine.easeOut, delay: .5 });
							TweenMax.fromTo(proj2.find('.download-bar'), .7, { x: window.innerWidth/2 }, { x: 0, ease: Sine.easeOut, delay: .6 });
							TweenMax.fromTo(proj2.find('.short-info'), .7, { x: window.innerWidth/2 }, { x: 0, ease: Sine.easeOut, delay: .7 });

						} else if (direction == 'prev') {

							TweenMax.to(Work.details.itemsEl, .7, { x: xVal, ease: Sine.easeOut, onComplete: function() {
								//
							}});
							TweenMax.to(proj.find('.about, .featured-in'), .7, { x: window.innerWidth, ease: Sine.easeOut, delay: .1 });
							TweenMax.to(proj.find('.download-bar'), .7, { x: window.innerWidth, ease: Sine.easeOut, delay: .05 });
							TweenMax.to(proj.find('.short-info'), .7, { x: window.innerWidth, ease: Sine.easeOut, delay: 0 });
							setTimeout(function() {
								TweenMax.to(Work.details.itemsHelperEl, .7, { x: xVal, ease: Sine.easeOut, onComplete: function() {
									Work.details.itemsEl.removeClass('animated');
									TweenMax.to(proj.find('.about, .featured-in, .download-bar, .short-info'), .01, { x: 0 });
								}});
							}, 100);

						}

						outgoingProjectEl.removeClass('visible');
						incomingProjectEl.addClass('visible');

						// title bar
						var titleIcon = $('.work-list .'+incomingProjectName+' a i').first().clone();
						var oldTitle = this.navEl.children('.title').children().first(),
							newTitle = $('<div class="'+incomingProjectName+' incoming-'+incomingDirection+'">'+incomingProjectTitle+'</div>');
						titleIcon.find('img[src*="nowness"]').attr('src', 'img/work/logo-nowness.svg');
						this.navEl.children('.title').append(newTitle)
							.children().last().prepend(titleIcon);
						oldTitle.addClass('outgoing-'+outgoingDirection).wait(500).remove();
						newTitle.wait(250).removeClass('incoming-'+incomingDirection);

					} else {

						workSwipe.slide(incomingProjectEl.index(), 500);

					}

				}

			}

		},

		init: function() {

			this.buildSlider();

			// keyboard navigation
			$window.on('keydown', function(e) {
				var key = e.charCode || e.keyCode || 0;

				if (Work.details.isOpen()) {
					if (key == 37) { // left
						Work.details.navigate('prev');
					} else if (key == 39) { // right
						Work.details.navigate('next');
					} else if (key == 27) { // esc
						Work.details.hide();
					}
				}
			});

			// navigation buttons
			this.navEl.find('span').click(function() {
				switch($(this).attr('class')) {
					case 'prev':
						Work.details.navigate('prev');
						break;
					case 'next':
						Work.details.navigate('next');
						break;
					case 'close':
						Work.details.hide();
						break;
				}
			});

			if (!Modernizr.touch) {
				$window.on('resize', function() {
					if (Work.details.isOpen()) {
						var xOffset = - Work.details.itemsEl.children('.visible').index() * $window.width();
						TweenMax.to(Work.details.itemsEl, .01, { x: xOffset });
					}
				});
			}

			// items helper
			if (!Modernizr.touch) {
				this.el.append($('<div class="items-wrapper-helper"></div>'));
				this.itemsWrapperHelperEl = this.el.children('.items-wrapper-helper');
				this.itemsEl.clone().appendTo(this.itemsWrapperHelperEl);
				this.itemsHelperEl = this.itemsWrapperHelperEl.children('.items');
				this.itemsHelperEl.attr('class', 'items-helper').children().removeClass('item').addClass('item-helper');
			}

      this.el.on('click', '[href="#contact"]', function(e) {
        Work.details.hide();
        e.preventDefault();
      });
		}
	},

	init: function() {
		var workList = $('.work-list');

		// show work item
		workList.on('click', 'a', function(e) {
			var projectName = $(this).closest('li').attr('class');
			Work.details.show(projectName);
			e.preventDefault();
		}).find('a').each(function() {
			var i = $(this).find('i');
			i.clone().insertAfter(i).addClass('i2');
			i.addClass('i1');
		});

		// load work images in the background
		if (!Modernizr.touch && window.innerWidth > tabletWidth) {
			var workBgImagesLoadInit = false;
			var loadWorkBgImages = function() {
				workBgImagesLoadInit = true;

				Work.details.el.find('.item').each(function() {
					var bg = 'img/work/details/' + $(this).data('bg');
					$('<img/>')[0].src = bg;
					$(this).css({ backgroundImage: 'url('+ bg +')' });
				});
			};
			$window.on('scroll', function() {
				if (!workBgImagesLoadInit) {
					if (scrollTop + window.innerHeight > workList.offset().top) {
						loadWorkBgImages();
					}
				}
			});
		}
		if (window.innerWidth <= tabletWidth) {
			$('.work-list a').each(function() {
				var index = $(this).parent().index();
				var bg = $(this).find('.bg1').css('background-image');
				Work.details.el.find('.item').eq(index).css({ backgroundImage: bg });
			});
		}

		this.details.init();

		// load svg icons
		$('.download-bar li').filter('.app-store, .google-play').each(function() {
			var icon = $(this).attr('class'),
				i = $('<i/>');
			i.load('img/logo-'+icon+'.svg');
			$(this).children('a').html(i);
		});

	}
};

/* Buttons
   ========================================================================== */

var Buttons = {

	init: function() {

		var buttons = $('.button');

		buttons.each(function() {
			$(this).prepend('<span class="helper"/>');
			$(this).attr('data-title', $(this).text());
		});
		buttons.on('mouseenter mousedown mouseup mouseleave', function(e) {
			var event = e.type,
				btn = $(this),
				helper = btn.children('.helper'),
				height;
			if (event == 'mouseenter' || event == 'mouseup') {
				height = btn.outerWidth() * .71;
			} else if (event == 'mousedown') {
				height = btn.outerWidth() * .85;
			} else if (event == 'mouseleave') {
				height = 0;
			}
			helper.height(height);
		});

	}
};

/* Forms
   ========================================================================== */

var Forms = {

	handleFormValidation: function() {

		$('form').parsley({
			errorsWrapper: '',
			trigger: 'blur'
		});

		$.listen('parsley:field:validate', function(fieldInstance) {
			var el = fieldInstance.$element,
				errorMessage = el.next('.error-message');
			if (errorMessage.length) {
				if (fieldInstance.isValid()) {
					errorMessage.removeClass('visible');
				} else {
					errorMessage.addClass('visible');
				}
			}
		});
	},

	contactForm: {

		el: $('.contact-form'),

		thankYouMessage: {

			el: $('.thank-you-message'),

			isOpen: function() {
				return this.el.hasClass('visible')
			},

			toggle: function(method) {
				var el = this.el,
					content = el.find('.content'),
					wrap = el.find('.wrap');

				if (method == 'show') { // show

					el.addClass('visible');
					content.wait(250).addClass('init');
					wrap.wait(500).addClass('visible');

					Header.el.addClass('transition').wait(10).addClass('hidden');
					$('#contact .wrap').css({ position: 'relative', left: '-'+(NavEnhancements.getScrollbarHeight() / 2)+'px' });
					$('body').addClass('no-scroll');

				} else if (method == 'hide') { // hide

					wrap.removeClass('visible');
					content.removeClass('init');
					el.wait(400).removeClass('visible');

					Header.el.removeClass('hidden').wait(500).removeClass('transition');
					$('#contact .wrap').css({ position: '', left: '' });
					$('body').removeClass('no-scroll');

				}
			}
		},

		endEditMode: function() {
			var sectionContact = $('.section-contact'),
				finishMessage = this.el.data('finish-message');
			this.el.addClass('sent');
			sectionContact.find('h1').first().text(finishMessage);
			this.el.find('input, textarea').attr('readonly', 'readonly');
		},

		restartEditMode: function() {
			var sectionContact = $('.section-contact'),
				form = this.el;
			sectionContact.addClass('restart-mode')
				.wait(500+100).removeClass('restart-mode');

			setTimeout(function() {
				form.removeClass('sent');
				sectionContact.find('h1').first().text('Contact');
				form.find('input, textarea').val('').removeAttr('readonly').first().focus();
			}, 500);
		},

		send: function() {
			$.post('contact-form/send.php', Forms.contactForm.el.serialize());
		},

		init: function() {
			var self = this,
				form = this.el;
			form.on('submit', function(e) {
				if (form.parsley().isValid()) {
					self.thankYouMessage.toggle('show');

					self.send();

					setTimeout(function() {
						self.endEditMode();
					}, 500);
				}
				e.preventDefault();
			});

			this.thankYouMessage.el.find('.close').on('click', function() {
				self.thankYouMessage.toggle('hide');
			});

			this.el.find('.new a').on('click', function(e) {
				self.restartEditMode();
				e.preventDefault();
			});

			// append error messages
			errorMessages = ['incorrect email', 'write something'];
			this.el.find('input[type=email], textarea').each(function() {
				var message;
				if ($(this).is('input')) {
					message = errorMessages[0];
				} else {
					message = errorMessages[1];
				}
				//(this).wrap('<span class="field-inner"/>');
				$(this).parent().append('<span class="error-message">'+message+'</span>');
			});

			// hey [visitor name] effect
			form.find('input[name="name"]').on('blur', function() {
				var val = $(this).val();
				if (val != '') {
					Fx.contactHeading.updateVisitorName(val);
				}
			});
		}
	},

	init: function() {
		this.handleFormValidation();
		this.contactForm.init();
	}
};

var NavEnhancements = {

	currentSlideIndex: 0,
	slidesCount: 8,

	getSlideOffset: function(slide) {
		var offset;
		if (slide < 3) {
			var factor = wiperSF;
			if (slide == 0) {
				offset = 0;
			} else if (slide == 1) {
				offset = factor * 120 + 1;
			} else if (slide == 2) {
				offset = factor * 300 + 1;
			}
		} else if (slide < this.slidesCount) {
			offset = ContentSections.el.children().eq(slide-3).offset().top;
		} else {
			offset = $('body').height() - window.innerHeight;
		}
		return offset;
	},

	goTo: function(slide) {

		if (!root.filter(':animated').length && this.canGo) {

			this.canGo = false;

			var incomingSlideIndex,
				scrollTop;

			if (typeof slide == 'number') {

				incomingSlideIndex = slide;

			} else if (typeof this.currentSlideIndex != 'undefined') {

				if (slide == 'prev') {
					incomingSlideIndex = Math.max(this.currentSlideIndex - 1, 0);
				} else if (slide == 'next') {
					incomingSlideIndex = Math.min(this.currentSlideIndex + 1, this.slidesCount);
				}

			}

			if (typeof incomingSlideIndex != 'undefined') {

				var top = this.getSlideOffset(incomingSlideIndex);

				root.stop().animate({
					scrollTop: top
				}, 750, 'easeOutCubic', function() {
					NavEnhancements.canGo = true;
				});

			}
		}
	},

	initKeyNav: function() {
		$window.on('keydown', function(e) {
			var key = e.charCode || e.keyCode || 0;
			if (!$('input, textarea').filter(':focus').length) {
				if (key == 38) { // up
					NavEnhancements.goTo('prev');
				} else if (key == 40) { // down
					NavEnhancements.goTo('next');
				}
				if (key == 38 || key == 40) {
					e.preventDefault();
				}
			}
		});
	},

	init: function() {

		this.canGo = true;

		this.initKeyNav();

		// disable scroll on touch devices
		// when menu open or projects open or contact form popup open
		$window.on('touchmove', function(e) {
			if (Menu.isOpen() || Work.details.isOpen() || Forms.contactForm.thankYouMessage.isOpen()) {
				e.preventDefault();
			}
		});

		$('a[href="#contact"]').on('click', function(e) {
			NavEnhancements.goTo(7);
			//Forms.contactForm.el.find(':text:first').wait(750).focus();
			e.preventDefault();
		});

		// change header icon color depending on bg
		if (!Modernizr.touch) {
			var workList = $('.work-list');
			$window.on('ready load resize scroll', function() {

				var bHeight = $('body').height(),
					fHeight = Footer.el.outerHeight(),
					f = bHeight - fHeight - scrollTop,
					d = workList.offset().top - scrollTop;

				if ((d < 46 && d > -444) || f < 48) {
					if (!Header.el.filter('.white-icons, .no-child-transitions').length) {
						Header.el.addClass('no-child-transitions')
							.wait(10).addClass('white-icons')
							.wait(10).removeClass('no-child-transitions');
					}
				} else {
					if (Header.el.filter('.white-icons, .no-child-transitions').length) {
						Header.el.addClass('no-child-transitions')
							.wait(10).removeClass('white-icons')
							.wait(10).removeClass('no-child-transitions');
					}
				}
			});
		}
	},

	getScrollbarHeight: function() {
		return window.innerWidth - $window.width();
	}
};

/* Fx
   ========================================================================== */

var Fx = {

	// typewriter effect
	contactHeading: {

		clearText: function(callback) {
			var heading = this.heading;
			var letters = heading.children().not('.char0'),
				cbTimeout = 1000;

			if (letters.filter('.char1').first().text() == 'h') { // hey there
				letters = letters.not('.char1, .char2, .char3, .char4');
				cbTimeout = 250;
			}

			letters = letters.get().reverse();
			$(letters).each(function(i) {
				var letter = $(this);
				setTimeout(function() {
					letter.remove();
					if (i == letters.length - 1) {
						if (typeof callback != 'undefined') {
							setTimeout(function() {
								callback();
							}, cbTimeout);
						}
					}
				}, i * 100);
			});
			heading.addClass('blinking-cursor');
		},

		sayHello: function(text) {
			var heading = this.heading,
				helloText = text,
				letters = helloText.split('');

			var n = parseInt(heading.children().last().attr('class').substr(-1));

			$.each(letters, function(i, v) {
				setTimeout(function() {
					heading.append('<span class="char'+(n+1)+'">'+v+'</span>');
					if (i == letters.length - 1) {
						setTimeout(function() {
							heading.removeClass('blinking-cursor');
						}, 100);
					}
					n++;
				}, i * 150);
			});
		},

		updateVisitorName: function(name) {
			var heading = this.heading;
			this.clearText(function() {
				Fx.contactHeading.sayHello(name);
			});
		},

		showTypewriterEffect: function() {
			this.clearText(function() {
				Fx.contactHeading.sayHello('hey there');
			})
		},

		init: function() {
			var contactHeading = $('.section-contact h1');
			contactHeading.wrapInner('<span/>');
			this.heading = contactHeading.children('span');
			this.heading.lettering();
			this.heading.prepend('<span class="char0">&nbsp;</span>');
		}
	},

	prepareMapAnimation: function() {

		if (!Modernizr.touch && window.innerWidth > tabletWidth) {

			var map = $('.world-map'),
				locations = map.children('.locations').children(),
				hq = map.children('.hq'),
				locationsShown = false;

			$window.on('scroll', function() {
				if (scrollTop + window.innerHeight > map.offset().top + 300) {
					if (!locationsShown) {
						locationsShown = true;
						locations.shuffle().each(function(i) {
							var li = $(this);
							setTimeout(function() {
								li.addClass('init');
								if (i == locations.length - 1) {
									hq.addClass('init');
								}
							}, i*50);
						});
					}
				}
			});
		}
	},

	prepareContactAnimation: function() {
		var contact = $('.section-contact');
		$window.on('scroll', function() {
			if (scrollTop + window.innerHeight > contact.offset().top + 300) {
				if (!Fx.contactHeading.heading.data('animation')) {
					setTimeout(function() {
						Fx.contactHeading.showTypewriterEffect();
					}, 1000);
				}
				Fx.contactHeading.heading.data('animation', 1);
			}
		});
	},

	init: function() {
		this.contactHeading.init();
		this.prepareContactAnimation();
		this.prepareMapAnimation();
	}
};

/* Browser Polyfills
   ========================================================================== */

'svg use'.replace(/\w+/g, function (element) {
	document.createElement(element);
});

/MSIE\s[678]\b/.test(navigator.userAgent) && document.attachEvent('onreadystatechange', function () {
	for (var all = document.getElementsByTagName('use'), index = 0, use; use = all[index]; ++index) {
		var img = new Image();

		img.src = use.getAttribute('xlink:href').replace('#', '.')+'.png';

		use.parentNode.replaceChild(img, use);
	}
});

/Trident\/[567]\b/.test(navigator.userAgent) && document.addEventListener('DOMContentLoaded', function () {
	[].forEach.call(document.querySelectorAll('use'), function (use) {
		var svg = use.parentNode, url = use.getAttribute('xlink:href');

		if (url) {
			var xhr = new XMLHttpRequest(), x = document.createElement('x');

			xhr.open('GET', url.replace(/#.+$/, ''));

			xhr.onload = function () {
				x.innerHTML = xhr.responseText;

				svg.replaceChild(x.querySelector(url.replace(/.+#/, '#')), use);
			};

			xhr.send();
		}
	});
});

/* Loader
   ========================================================================== */

var Loader = {

	el: $('.loader'),
	barEl: $('.loader .bar'),
	progressEl: $('.loader .progress'),

	updateProgress: function(value) {
		this.progressEl.css({ width: value+'%' });
	},

	hide: function() {
		this.barEl.addClass('hidden');

		setTimeout(function() {
			Loader.el.addClass('hidden');
			$('body').addClass('released');

			setTimeout(function() {
				IntroSection.play();
			}, 750);
		}, 1);
	}
};

/* Preloading
   ========================================================================== */

var assetsCounterMax = !Modernizr.touch && window.innerWidth > tabletWidth ? 15 : 14;

var updateLoadedAssetsCounter = function(assetType) {
	loadedAssetsCounter++;
	var percentage = parseInt(loadedAssetsCounter / assetsCounterMax * 100);
	if (percentage.toString().length == 1) {
		percentage = '  ' + percentage;
	} else if (percentage.toString().length == 2) {
		percentage = ' ' + percentage;
	}
	//var log = '<b>' + percentage + '%</b>   ' + assetType + ' loaded<br>';
	//$('#preloading-log').append(log);

	Loader.updateProgress(percentage);

	if (loadedAssetsCounter == assetsCounterMax) {
		//log = '       ready to go!';
		//$('#preloading-log').append(log);

		setTimeout(function() {
			Loader.hide();
		}, 150);
	}
};

var loadJsAssets = function(callback) {
	$.ajax({
		url: 'js/libs-combined.min.js',
		dataType: "script",
		cache: true
	}).done(function() {
		updateLoadedAssetsCounter('javascript');
		callback();
	});
}

var loadSvgSprites = function() {

	$.each([
		'client-icons',
		'work-icons',
		'service-icons',
		'nav-icons'
	], function(i, val) {
		$('<span class="svg-sprite"/>').load('img/'+val+'.svg').prependTo('body');
		updateLoadedAssetsCounter('svg sprite');
	});

	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)) { // mobile safari
		$('svg use').each(function() {
			var href = $(this).attr('xlink:href');
			var filename = 'img/';
			if (href.substr(1,6) == 'client') {
				filename += 'client-icons.svg';
			} else if (href.substr(1,4) == 'work') {
				filename += 'work-icons.svg';
			} else if (href.substr(1,7) == 'service') {
				filename += 'service-icons.svg';
			} else if (href.substr(1,3) == 'nav') {
				filename += 'nav-icons.svg';
			}
			href = filename + href;
			if (filename.length > 4) {
				$(this).attr('xlink:href', href);
			}
		});
	}
}

/* Start
   ========================================================================== */

$(function() {

	loadJsAssets(function() {

		$('body').imagesLoaded().progress(function() {
			updateLoadedAssetsCounter('image');
		});

		loadSvgSprites();

		Core.init();
		ContentSections.init();
		ContentEnhancements.init();
		Header.init();
		Footer.init();
		Menu.init();
		IntroSection.init();
		Work.init();
		Buttons.init();
		Forms.init();
		NavEnhancements.init();
		Fx.init();

	});

});
