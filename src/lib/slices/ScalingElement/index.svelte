
<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps  } from '@prismicio/svelte';
	import { PrismicRichText } from '@prismicio/svelte';
	import { gsap, ScrollTrigger, Flip } from '$lib/gsap';
	import { onMount } from 'svelte';
	
	type Props = SliceComponentProps<Content.HeroWithMediaSlice>;

	const { slice }: Props = $props();

	gsap.registerPlugin(ScrollTrigger, Flip);

	function initFlipOnScroll() {
  let wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']");
  let targetEl = document.querySelector("[data-flip-element='target']");

  let tl;
  function flipTimeline() {
    if (tl) {
      tl.kill();
      gsap.set(targetEl, { clearProps: "all" });
    }
    
    // Use the first and last wrapper elements for the scroll trigger.
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperElements[0],
        start: "center center",
        endTrigger: wrapperElements[wrapperElements.length - 1],
        end: "center center",
        scrub: 0.25
      }
    });
    
    // Loop through each wrapper element.
    wrapperElements.forEach(function(element, index) {
      let nextIndex = index + 1;
      if (nextIndex < wrapperElements.length) {
        let nextWrapperEl = wrapperElements[nextIndex];
        // Calculate vertical center positions relative to the document.
        let nextRect = nextWrapperEl.getBoundingClientRect();
        let thisRect = element.getBoundingClientRect();
        let nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
        let thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
        let offset = nextDistance - thisDistance;
        // Add the Flip.fit tween to the timeline.
        tl.add(
          Flip.fit(targetEl, nextWrapperEl, {
            duration: offset,
            ease: "none"
          })
        );
      }
    });
  }

  flipTimeline();

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      flipTimeline();
    }, 100);
  });
}

// Initialize Scaling Elements on Scroll (GSAP Flip)
onMount(() => {
  initFlipOnScroll();
});
</script>

<section class="scaling-element" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	
	<!-- <div class="background__gradient">
		<img src="/gradient-background.webp" alt="" aria-hidden="true" />
	</div> -->

  <section class="scaling-element-header">
		<div class="scaling-element-header__title">
			<PrismicRichText field={slice.primary.title} />
		</div>
    <div class="scaling-element__small-box">
      <div class="scaling-video__before"></div>
      <div data-flip-element="wrapper" class="scaling-video__wrapper">
        <div data-flip-element="target" class="scaling-video">
          <video autoplay="autoplay" muted playsinline="" loop="" webkit-playsinline="" class="scaling-video__video"><source src="{slice.primary.video_link}" type="video/mp4"></video>
        </div>
      </div>
    </div>
  </section>
  <section class="scaling-element-video">
    <div class="scaling-element__big-box">
      <div class="scaling-video__before"></div>
      <div data-flip-element="wrapper" class="scaling-video__wrapper"></div>
    </div>
  </section>
</section>


<style lang="scss">
.scaling-element {
  position: relative;
  overflow: hidden;
	color: var(--off-white);
}

.scaling-element-header {
  grid-column-gap: 3em;
  grid-row-gap: 3em;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  // padding: 25vh 5vw 20vh;
  display: flex;
  position: relative;
}

.scaling-element-header__title{
  text-align: center;
  max-width: 1550px;
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
	color: var(--off-white);
	letter-spacing: -0.02em;
	line-height: 95%;
	font-style: italic;
}

.scaling-element-video {
  grid-column-gap: 25vh;
  grid-row-gap: 25vh;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 25vh;
  padding-left: 5vw;
  padding-right: 5vw;
  display: flex;
  position: relative;
}

.scaling-element__big-box {
  border-radius: 1.5rem;
  width: 100%;
  position: relative;
}

.scaling-element__small-box {
  border-radius: 1.5rem;
  width: 20em;
  position: relative;
}

.scaling-video__wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.scaling-video {
  will-change: transform;
  border-radius: 1em;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  isolation: isolate;
  transform: translateX(0) rotate(0.001deg);
}

.scaling-video__before {
  padding-top: 56.25%;
}

.scaling-video__video {
  object-fit: cover;
  width: 100%;
  height: 100%;
  padding-bottom: 0;
  padding-right: 0;
  position: absolute;
  border-radius: inherit;
}


@media screen and (max-width: 767px) {
  .scaling-element__small-box {
    width: 15em;
  }

}


</style>
