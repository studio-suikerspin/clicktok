<script>
	let { children, index } = $props();
</script>

<li class="gsap-slider__item" data-index={index}>
	{@render children()}
</li>
