<script>
	import { PrismicImage, PrismicLink } from '@prismicio/svelte';

	let { caseItem } = $props();
</script>

<div class="featured-case">
	<PrismicImage field={caseItem.data?.featured_image} class="featured-case__image" />

	<div class="featured-case__overlay">
		{#if caseItem.data?.brand_logo}
			<PrismicImage field={caseItem.data?.brand_logo} class="featured-case__logo" />
		{:else}
			<div class="featured-case__title">
				{caseItem.data?.title}
			</div>
		{/if}

		<PrismicLink field={caseItem.data?.url} class="btn btn--outline featured-case__link">
			Bekijk case <i class="fas fa-arrow-right"></i>
		</PrismicLink>
	</div>
</div>

<style lang="scss">
	.featured-case {
		background-color: #2c2c2c;
		justify-content: center;
		align-items: center;
		aspect-ratio: 3/4;
		display: flex;
		position: relative;
		overflow: hidden;
		width: 100%;
		max-width: 300px;

		&__overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			height: 100%;

			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: flex-end;
			gap: 1rem;

			padding-block: 2rem;
			padding-inline: 2rem;

			transition: all 150ms ease-out;
		}

		:global &__logo {
			width: 100%;
			max-width: 100px;
			transform: translateY(100%);
			transition: all 150ms ease-out;
		}

		:global &__image {
			object-fit: cover;
			width: 100%;
			height: 100%;
			transition: all 300ms ease-out;
		}

		:global &__link {
			opacity: 0;
			transform: translateY(100%);
			transition: all 150ms ease-out;
		}

		&:hover {
			:global .featured-case__image {
				transform: scale(1.05);
				transition: all 75ms ease-out;
			}

			.featured-case__overlay {
				background-color: rgba(0, 0, 0, 0.5);
				transition: all 150ms ease-out;
			}

			:global .featured-case__logo {
				transform: translateY(0);
				transition: all 150ms ease-out;
			}

			:global .featured-case__link {
				opacity: 1;
				transform: translateY(0);
				transition: all 150ms ease-out;
			}
		}
	}
</style>
