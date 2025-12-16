<script lang="ts">
	import { gsap } from '$lib/gsap';
	import verticalLoop from '$lib/utils/verticalLoop';
	import { isFilled } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import GsapSliderItem from './GsapSliderItem.svelte';

	let {
		slides,
		slide,
		key,
		reversed = false,
		speed = 0.3,
		center = true,
		draggable = true
	} = $props();

	let sliderSlides = $derived(slides);

	if (reversed) {
		sliderSlides = sliderSlides.reverse();
	}

	onMount(() => {
		const ctx = gsap.context(() => {
			const slider = document.querySelector(`.gsap-slider[data-slider-key="${key}"]`);
			const items = gsap.utils.toArray('.gsap-slider__item', slider);

			const loop = verticalLoop(items, {
				draggable: draggable,
				center: center,
				speed: speed,
				repeat: -1,
				paddingBottom: 16,
				reversed: reversed ? true : false
			});

			slider?.addEventListener('onmouseenter', () => loop.pause());
			slider?.addEventListener('onmouseleave', () => loop.resume());
		});

		return () => ctx.revert();
	});
</script>

<div class="gsap-slider" data-slider-key={key}>
	<ul class="gsap-slider__list gsap-slider__list--column1">
		{#each sliderSlides as { case: item }, index (item)}
			<GsapSliderItem {index}>
				{@render slide(item)}
			</GsapSliderItem>
		{/each}
	</ul>
</div>

<style lang="scss">
	.gsap-slider {
		--space-between: 1rem;
		overflow: hidden;
		max-height: 100vh;

		&__list {
			display: flex;
			flex-direction: column;
			gap: var(--space-between);
			overflow: hidden;
			position: relative;
			will-change: transform;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		&__item {
			display: flex;
			flex: 0 0 auto;
			position: relative;
			width: 100%;
			backface-visibility: hidden;
		}

		.carousel-nav {
			position: absolute;
			bottom: 2rem;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			gap: 1rem;
			z-index: 10;

			button {
				background: transparent;
				border: 1px solid rgba(255, 255, 255, 0.5);
				color: white;
				cursor: pointer;
				padding: 0.5rem 1rem;
				transition: opacity 0.3s ease;

				&:hover {
					opacity: 0.7;
				}
			}

			div {
				color: rgba(255, 255, 255, 0.5);
				font-size: 0.875rem;
			}
		}
	}
</style>
