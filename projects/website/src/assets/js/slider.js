var CRUMINAJS = {};
!function (o) {
  "use strict";
  var e = o(document), t = o(".crumina-skills-item"), a = o(".site-header"), i = o("#site-footer"),
    n = o(".crumina-countdown-number"), s = o("#hellopreloader");
    CRUMINAJS.preloader = function () {
    return setTimeout(function () {
      s.fadeOut(800)
    }, 500), !1
  },
    CRUMINAJS.progresBars = function () {
      t.length && t.each(function () {
        jQuery(this).waypoint(function () {
          o(this.element).find(".count-animate").countTo(), o(this.element).find(".skills-item-meter-active").fadeTo(300, 1).addClass("skills-animate"), this.destroy()
        }, {offset: "90%"})
      })
    },
    CRUMINAJS.navigation = function () {
      new Navigation(document.getElementById("navigation"))
    },
    CRUMINAJS.initSmoothScroll = function () {
      new SmoothScroll('a[href*="#"]', {
        speed: 6e3,
        offset: a.height(),
        easing: "easeInOutCubic",
        speedAsDuration: !0,
        durationMax: 1e3
      })
    },
    CRUMINAJS.fixedHeader = function () {
      var e = o(".header--sticky");
      0 != e.offset().top && e.addClass("header--fixed"), o(document).on("scroll", function () {
        50 < o(document).scrollTop() ? e.addClass("header--fixed") : e.removeClass("header--fixed")
      })
    },
    CRUMINAJS.Swiper = {
      $swipers: {}, init: function () {
        var i = this;
        o(".swiper-container").each(function (e) {
          var t = o(this), a = "swiper-unique-id-" + e;
          t.addClass(a + " initialized").attr("id", a), t.closest(".crumina-module").find(".swiper-pagination").addClass("pagination-" + a), i.$swipers[a] = new Swiper("#" + a, i.getParams(t, a)), i.addEventListeners(i.$swipers[a])
        })
      }, getParams: function (e, t) {
        var a = {
          parallax: !0,
          breakpoints: !1,
          keyboardControl: !0,
          setWrapperSize: !0,
          preloadImages: !1,
          lazy: !0,
          updateOnImagesReady: !0,
          prevNext: !!e.data("prev-next") && e.data("prev-next"),
          changeHandler: e.data("change-handler") ? e.data("change-handler") : "",
          direction: e.data("direction") ? e.data("direction") : "horizontal",
          mousewheel: !!e.data("mouse-scroll") && {releaseOnEdges: !0},
          slidesPerView: e.data("show-items") ? e.data("show-items") : 1,
          slidesPerGroup: e.data("scroll-items") ? e.data("scroll-items") : 1,
          spaceBetween: e.data("space-between") || 0 == e.data("space-between") ? e.data("space-between") : 20,
          centeredSlides: !!e.data("centered-slider") && e.data("centered-slider"),
          autoplay: !!e.data("autoplay") && {delay: parseInt(e.data("autoplay"))},
          autoHeight: !!e.hasClass("auto-height"),
          loop: 0 != e.data("loop") || e.data("loop"),
          effect: e.data("effect") ? e.data("effect") : "slide",
          pagination: {
            type: e.data("pagination") ? e.data("pagination") : "bullets",
            el: ".pagination-" + t,
            clickable: !0
          },
          coverflow: {
            stretch: e.data("stretch") ? e.data("stretch") : 0,
            depth: e.data("depth") ? e.data("depth") : 0,
            slideShadows: !1,
            rotate: 0,
            modifier: 2
          },
          fade: {crossFade: !e.data("crossfade") || e.data("crossfade")}
        };
        return 1 < a.slidesPerView && (a.breakpoints = {
          320: {slidesPerView: 1, slidesPerGroup: 1},
          480: {slidesPerView: 2, slidesPerGroup: 2},
          769: {slidesPerView: a.slidesPerView, slidesPerGroup: a.slidesPerView}
        }), a
      }, addEventListeners: function (a) {
        var t = this, i = a.$el.closest(".crumina-module-slider");
        a.params.prevNext && i.on("click", ".swiper-btn-next, .swiper-btn-prev", function (e) {
          e.preventDefault(), o(this).hasClass("swiper-btn-next") ? a.slideNext() : a.slidePrev()
        }), i.on("click", ".slider-slides .slides-item", function (e) {
          e.preventDefault();
          var t = o(this);
          a.params.loop ? a.slideToLoop(t.index()) : a.slideTo(t.index())
        }), a.on("slideChange", function () {
          var e = t.changes[a.params.changeHandler];
          "function" == typeof e && e(a, i, t, this.realIndex)
        })
      }, changes: {
        thumbsParent: function (e, t) {
          var a = t.find(".slider-slides .slides-item");
          a.removeClass("swiper-slide-active"), a.eq(e.realIndex).addClass("swiper-slide-active")
        }
      }
    },
    e.ready(function () {
        CRUMINAJS.Swiper.init(),
        CRUMINAJS.navigation(),
        CRUMINAJS.progresBars(),
        CRUMINAJS.initSmoothScroll(),
      o(".header--sticky").length && CRUMINAJS.fixedHeader()
    })
}(jQuery)
