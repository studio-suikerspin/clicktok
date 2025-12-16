<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { isFilled } from '@prismicio/client';
	import { PrismicLink, PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';

	import GsapSlider from '$lib/components/GsapSlider.svelte';
	import FeaturedCase from '$lib/components/FeaturedCase.svelte';

	type Props = SliceComponentProps<Content.HeroSlice>;

	const { slice }: Props = $props();
</script>

{#snippet slide(caseItem)}
	<FeaturedCase {caseItem} />
{/snippet}

<section class="hero" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="hero__inner">
		<div class="hero__content">
			<div class="hero__headline-wrap">
				<div class="hero__subheadline font-syne">{slice.primary.subheadline}</div>
				<div class="hero__headline font-syne">
					<PrismicRichText field={slice.primary.headline} />
				</div>
			</div>

			<div class="hero__summary">
				<PrismicRichText field={slice.primary.summary} />
			</div>

			<div class="hero__ctas">
				{#each slice.primary.cta as item (item)}
					<PrismicLink field={item} class="btn btn--{item.variant}" />
				{/each}
			</div>
		</div>

		<div class="hero__sliders-wrap">
			<GsapSlider slides={slice.primary.featured_cases} {slide} key="slider-1" />
			<GsapSlider slides={slice.primary.featured_cases} {slide} key="slider-2" reversed={true} />
		</div>
	</div>
</section>

<style lang="scss">
	.hero {
		&__inner {
			min-height: 100svh;
			display: flex;
			flex-flow: row;
			justify-content: space-between;
			padding-inline: 2rem;

			max-width: 1500px;
			margin-inline: auto;
		}

		&__content {
			flex: 1;
			display: flex;
			flex-flow: column;
			align-items: flex-start;
			justify-content: center;
			gap: 2.5rem;

			max-width: 750px;
		}

		&__headline-wrap {
			display: flex;
			flex-flow: column;
			align-items: flex-start;
			gap: 1rem;
		}

		&__subheadline {
			font-size: 2rem;
			color: var(--off-white);
			font-weight: 600;
			line-height: 100%;
		}

		&__headline {
			font-size: 6rem;
			color: var(--off-white);
			font-weight: 700;
			line-height: 100%;
			text-wrap: nowrap;

			:global strong {
				color: var(--accent-blue);
				font-weight: unset;
			}
		}

		&__summary {
			font-weight: 500;
			color: var(--off-white);
			line-height: 150%;

			text-wrap: balance;
		}

		&__ctas {
			display: flex;
			flex-flow: row;
			gap: 1rem;
		}

		&__sliders-wrap {
			position: relative;
			display: flex;
			flex-flow: row;
			gap: 1rem;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(
					rgba(0, 0, 0, 1) 1%,
					rgba(0, 0, 0, 0) 6%,
					rgba(0, 0, 0, 0) 94%,
					rgba(0, 0, 0, 1) 99%
				);
				pointer-events: none;
			}
		}
	}

	:global .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		padding-inline: 1.5rem;
		padding-block: 1rem;
		border-radius: 0.25rem;

		font-family: 'Syne', sans-serif;
		font-weight: 700;
		color: var(--off-white);

		&--pink {
			background: var(--accent-pink);
		}

		&--white {
			background: var(--off-white);
			color: var(--black);
		}

		&--blue {
			background: var(--accent-blue);
		}

		&--outline {
			background: transparent;
			border: 2px solid var(--off-white);
			color: var(--off-white);
		}
	}
</style>
