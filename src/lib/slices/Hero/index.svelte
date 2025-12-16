<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { isFilled } from '@prismicio/client';
	import { PrismicLink, PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';

	import GsapSlider from '$lib/components/GsapSlider.svelte';

	type Props = SliceComponentProps<Content.HeroSlice>;

	const { slice }: Props = $props();
</script>

<section class="hero" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="hero__inner">
		<div class="hero__content">
			<div class="hero__headline">
				<PrismicRichText field={slice.primary.headline} />
			</div>

			<div class="hero__ctas">
				{#each slice.primary.cta as item (item)}
					<PrismicLink field={item} class="btn btn--{item.variant}" />
				{/each}
			</div>
		</div>

		<GsapSlider slides={slice.primary.featured_cases} />
	</div>
</section>

<!-- <section class="h-[100vh]"></section> -->

<style lang="scss">
	.hero {
		&__inner {
			min-height: 100svh;
			display: flex;
			flex-flow: column;

			padding-block: 4rem;
		}

		&__content {
			flex: 1;
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;
			gap: 2.5rem;
		}

		&__headline {
			font-size: clamp(2.5rem, -0.2581rem + 9.8065vw, 12rem);
			color: var(--off-white);
			font-weight: 800;
			line-height: 100%;
			text-align: center;
			// text-transform: uppercase;

			:global strong {
				color: var(--accent-blue);
				font-weight: unset;
			}
		}

		&__ctas {
			display: flex;
			flex-flow: row;
			gap: 1rem;
		}
	}

	:global .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		padding-inline: 1.5rem;
		padding-block: 1rem;
		color: var(--off-white);
		font-weight: 600;

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
