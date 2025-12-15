<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps  } from '@prismicio/svelte';
	import { PrismicRichText } from '@prismicio/svelte';




	type Props = SliceComponentProps<Content.HeroWithMediaSlice>;


	const { slice }: Props = $props();
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="scaling-element">
		<div class="container">
			<div class="scaling-element__content">
				<div class="scaling-element__title">
					<PrismicRichText field={slice.primary.title} />
				</div>
				<div class="scaling-element__video">
					 <video controls muted autoplay loop>
					  <source src={slice.primary.video_link} type="video/mp4">
					  </video>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
.scaling-element {
	color: var(--off-white);

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-block: 4rem;
		gap: 2.5rem;
	}
	&__title{
		max-width: 1500px;
	}
	&__title :global(h2) {
		 font-size: 4.5rem;
		font-weight: 700;
		text-align: center;
		font-style: italic;
		line-height: 100%;
		letter-spacing: -0.03em;
	}
	&__video{
		width: 100%;
	}
	&__video video{ 
		width: 100%;
	}
}

</style>
