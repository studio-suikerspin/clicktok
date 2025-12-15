<script lang="ts">
	import { onMount } from 'svelte';
	import { isFilled } from '@prismicio/client';
	import { gsap, Draggable, InertiaPlugin, ScrollTrigger } from '$lib/gsap';
	import { PrismicImage } from '@prismicio/svelte';

	let { slides } = $props();
	let activeSlide = 0;
	let firstRun = true;

	onMount(() => {
		const ctx = gsap.context(() => {
			let pointerDown = false;
			const slider = document.querySelector('.featured-slider__list');
			const items = gsap.utils.toArray('.featured-slider__item', slider);
			const prev = document.querySelector('.prev');
			const next = document.querySelector('.next');

			gsap.set(slider, { 'scroll-snap-type': 'none' });

			const loop = horizontalLoop(items, {
				paused: false, // no auto-scroll
				speed: 0.7,
				paddingRight: 16, // match the 10px flex gap
				center: true, // snap the active slide to the center
				draggable: true, // requires Draggable & InertiaPlugin
				onChange: (slide, index) => {
					// called when the active slide changes
					if (activeSlide) {
						gsap.to('.carousel h2, .carousel h5', { overwrite: true, opacity: 0, ease: 'power3' });
						gsap.to('.active', { opacity: 0.3 });
						activeSlide.classList.remove('active');
					}
					slide.classList.add('active');
					activeSlide = slide;

					// intro animation for new active slide
					gsap
						.timeline({ defaults: { ease: 'power1.inOut' } })
						.to('.active', { opacity: 1, ease: 'power2.inOut' }, 0)
						.to('.carousel-nav div', { duration: 0.2, opacity: 0, ease: 'power1.in' }, 0)
						.set('.carousel-nav div', { innerText: `${index + 1}/${slides.length}` }, 0.2)
						.to('.carousel-nav div', { duration: 0.4, opacity: 0.5, ease: 'power1.inOut' }, 0.2)
						.to('.active h2, .active h5', { opacity: 1, ease: 'power1.inOut' }, 0.3)
						.fromTo(
							'.active h2, .active h5',
							{ y: (i) => [40, 60][i] },
							{ duration: 1.5, y: 0, ease: 'expo' },
							0.3
						)
						.progress(firstRun ? 1 : 0); // skip active slide animation on first run
				},
				onPress: () => {
					pointerDown = true;
					gsap
						.timeline({ defaults: { overwrite: 'auto', ease: 'expo' } })
						.to(slider, { scale: 0.9 }, 0)
						.to('.featured-slider__item', { opacity: 1 }, 0)
						.to('.featured-slider__item .featured-case', { scale: 0.8 }, 0);
				},
				onRelease: () => {
					pointerDown = false;
					gsap
						.timeline({ defaults: { overwrite: 'auto', ease: 'power1.inOut' } })
						.to(slider, { scale: 1, ease: 'expo' }, 0)
						.to(
							'.featured-slider__item',
							{ opacity: (i, t) => (t.classList.contains('active') ? 1 : 0.2) },
							0
						)
						.to('.featured-slider__item .featured-case', { scale: 1 }, 0);
				}
			});

			gsap.set('.featured-slider__item', { opacity: (i) => (i === 0 ? 1 : 0.3) });
			function arrowBtnOver(e) {
				gsap.to(e.target, { opacity: 0.4 });
			}
			function arrowBtnOut(e) {
				gsap.to(e.target, { opacity: 1 });
			}

			next.addEventListener('pointerover', arrowBtnOver);
			next.addEventListener('pointerout', arrowBtnOut);
			next.addEventListener('click', () => loop.next({ duration: 1, ease: 'expo' }));

			prev.addEventListener('pointerover', arrowBtnOver);
			prev.addEventListener('pointerout', arrowBtnOut);
			prev.addEventListener('click', () => loop.previous({ duration: 1, ease: 'expo' }));

			items.forEach((slide, i) => {
				slide.addEventListener('click', () => loop.toIndex(i, { duration: 1, ease: 'expo' }));
			});

			slider?.addEventListener('pointerover', () => {
				loop.paused(true);
			});
			slider?.addEventListener('pointerout', () => {
				loop.paused(false);
			});

			loop.toIndex(0, { duration: 0 });
			firstRun = false;

			// ScrollTrigger.create({
			// 	trigger: '.featured-slider',
			// 	start: 'top bottom',
			// 	end: '+=300%', // scroll distance (adjust as needed)
			// 	pin: false,
			// 	scrub: 1, // smooth scrubbing (1 second delay)
			// 	onUpdate: (self) => {
			// 		// scrub through the loop timeline based on + scroll progress
			// 		loop.timeScale(1).progress(self.progress);
			// 	}
			// });
		});

		return () => ctx.revert();
	});

	/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Source: https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop

Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like draggable: true, center: true, speed (default: 1, which travels at roughly 100 pixels per second), paused (boolean), repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot.
 */
	function horizontalLoop(items, config) {
		let timeline;
		items = gsap.utils.toArray(items);
		config = config || {};
		gsap.context(() => {
			// use a context so that if this is called from within another context or a gsap.matchMedia(), we can perform proper cleanup like the "resize" event handler on the window
			let onChange = config.onChange,
				lastIndex = 0,
				tl = gsap.timeline({
					repeat: config.repeat,
					onUpdate:
						onChange &&
						function () {
							let i = tl.closestIndex();
							if (lastIndex !== i) {
								lastIndex = i;
								onChange(items[i], i);
							}
						},
					paused: config.paused,
					defaults: { ease: 'none' },
					onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
				}),
				length = items.length,
				startX = items[0].offsetLeft,
				times = [],
				widths = [],
				spaceBefore = [],
				xPercents = [],
				curIndex = 0,
				indexIsDirty = false,
				center = config.center,
				pixelsPerSecond = (config.speed || 1) * 100,
				snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
				timeOffset = 0,
				container =
					center === true
						? items[0].parentNode
						: gsap.utils.toArray(center)[0] || items[0].parentNode,
				totalWidth,
				getTotalWidth = () =>
					items[length - 1].offsetLeft +
					(xPercents[length - 1] / 100) * widths[length - 1] -
					startX +
					spaceBefore[0] +
					items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], 'scaleX') +
					(parseFloat(config.paddingRight) || 0),
				populateWidths = () => {
					let b1 = container.getBoundingClientRect(),
						b2;
					items.forEach((el, i) => {
						widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'));
						xPercents[i] = snap(
							(parseFloat(gsap.getProperty(el, 'x', 'px')) / widths[i]) * 100 +
								gsap.getProperty(el, 'xPercent')
						);
						b2 = el.getBoundingClientRect();
						spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
						b1 = b2;
					});
					gsap.set(items, {
						// convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
						xPercent: (i) => xPercents[i]
					});
					totalWidth = getTotalWidth();
				},
				timeWrap,
				populateOffsets = () => {
					timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
					center &&
						times.forEach((t, i) => {
							times[i] = timeWrap(
								tl.labels['label' + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset
							);
						});
				},
				getClosest = (values, value, wrap) => {
					let i = values.length,
						closest = 1e10,
						index = 0,
						d;
					while (i--) {
						d = Math.abs(values[i] - value);
						if (d > wrap / 2) {
							d = wrap - d;
						}
						if (d < closest) {
							closest = d;
							index = i;
						}
					}
					return index;
				},
				populateTimeline = () => {
					let i, item, curX, distanceToStart, distanceToLoop;
					tl.clear();
					for (i = 0; i < length; i++) {
						item = items[i];
						curX = (xPercents[i] / 100) * widths[i];
						distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
						distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
						tl.to(
							item,
							{
								xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
								duration: distanceToLoop / pixelsPerSecond
							},
							0
						)
							.fromTo(
								item,
								{ xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
								{
									xPercent: xPercents[i],
									duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
									immediateRender: false
								},
								distanceToLoop / pixelsPerSecond
							)
							.add('label' + i, distanceToStart / pixelsPerSecond);
						times[i] = distanceToStart / pixelsPerSecond;
					}
					timeWrap = gsap.utils.wrap(0, tl.duration());
				},
				refresh = (deep) => {
					let progress = tl.progress();
					tl.progress(0, true);
					populateWidths();
					deep && populateTimeline();
					populateOffsets();
					deep && tl.draggable && tl.paused()
						? tl.time(times[curIndex], true)
						: tl.progress(progress, true);
				},
				onResize = () => refresh(true),
				proxy;
			gsap.set(items, { x: 0 });
			populateWidths();
			populateTimeline();
			populateOffsets();
			window.addEventListener('resize', onResize);
			function toIndex(index, vars) {
				vars = vars || {};
				Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length); // always go in the shortest direction
				let newIndex = gsap.utils.wrap(0, length, index),
					time = times[newIndex];
				if (time > tl.time() !== index > curIndex && index !== curIndex) {
					// if we're wrapping the timeline's playhead, make the proper adjustments
					time += tl.duration() * (index > curIndex ? 1 : -1);
				}
				if (time < 0 || time > tl.duration()) {
					vars.modifiers = { time: timeWrap };
				}
				curIndex = newIndex;
				vars.overwrite = true;
				gsap.killTweensOf(proxy);
				return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
			}
			tl.toIndex = (index, vars) => toIndex(index, vars);
			tl.closestIndex = (setCurrent) => {
				let index = getClosest(times, tl.time(), tl.duration());
				if (setCurrent) {
					curIndex = index;
					indexIsDirty = false;
				}
				return index;
			};
			tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
			tl.next = (vars) => toIndex(tl.current() + 1, vars);
			tl.previous = (vars) => toIndex(tl.current() - 1, vars);
			tl.times = times;
			tl.progress(1, true).progress(0, true); // pre-render for performance
			if (config.reversed) {
				tl.vars.onReverseComplete();
				tl.reverse();
			}
			if (config.draggable && typeof Draggable === 'function') {
				proxy = document.createElement('div');
				let wrap = gsap.utils.wrap(0, 1),
					ratio,
					startProgress,
					draggable,
					dragSnap,
					lastSnap,
					initChangeX,
					wasPlaying,
					align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
					syncIndex = () => tl.closestIndex(true);
				typeof InertiaPlugin === 'undefined' &&
					console.warn(
						'InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club'
					);
				draggable = Draggable.create(proxy, {
					trigger: items[0].parentNode,
					type: 'x',
					onPressInit() {
						config.onPress();

						let x = this.x;
						gsap.killTweensOf(tl);
						wasPlaying = !tl.paused();
						tl.pause();
						startProgress = tl.progress();
						refresh();
						ratio = 1 / totalWidth;
						initChangeX = startProgress / -ratio - x;
						gsap.set(proxy, { x: startProgress / -ratio });
					},
					onDrag: align,
					onThrowUpdate: align,
					overshootTolerance: 0,
					inertia: true,
					snap(value) {
						//note: if the user presses and releases in the middle of a throw, due to the sudden correction of proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap. So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent the inertia from causing it to shoot past and come back
						if (Math.abs(startProgress / -ratio - this.x) < 10) {
							return lastSnap + initChangeX;
						}
						let time = -(value * ratio) * tl.duration(),
							wrappedTime = timeWrap(time),
							snapTime = times[getClosest(times, wrappedTime, tl.duration())],
							dif = snapTime - wrappedTime;
						Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
						lastSnap = (time + dif) / tl.duration() / -ratio;
						return lastSnap;
					},
					onRelease() {
						config.onRelease();

						syncIndex();
						draggable.isThrowing && (indexIsDirty = true);
					},
					onThrowComplete: () => {
						syncIndex();
						wasPlaying && tl.play();
					}
				})[0];
				tl.draggable = draggable;
			}
			tl.closestIndex(true);
			lastIndex = curIndex;
			onChange && onChange(items[curIndex], curIndex);
			timeline = tl;
			return () => window.removeEventListener('resize', onResize); // cleanup
		});
		return timeline;
	}
</script>

<div class="featured-slider">
	<ul class="featured-slider__list">
		{#each slides as { case: slide } (slide)}
			{#if isFilled.contentRelationship(slide)}
				<li class="featured-slider__item">
					<div class="featured-case">
						<PrismicImage field={slide.data?.featured_image} />
					</div>
				</li>
			{/if}
		{/each}
	</ul>
	<nav class="carousel-nav">
		<button class="prev" tabindex="0" aria-label="Previous Slide"></button>
		<button class="next" tabindex="0" aria-label="Next Slide"></button>
		<div>1/{slides.length}</div>
	</nav>
</div>

<style lang="scss">
	.featured-slider {
		padding-block: 4rem 0;

		--slides-per-view: 1;
		--space-between: 1rem;

		@media screen and (min-width: 768px) {
			--slides-per-view: 3;
		}

		@media screen and (min-width: 1200px) {
			--slides-per-view: 4;
		}

		&__list {
			display: flex;
			gap: var(--space-between);

			width: 100vw;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		&__item {
			display: flex;
			flex: 0 0
				calc(
					(100vw - (var(--space-between) * (var(--slides-per-view) - 1))) / var(--slides-per-view)
				);
			position: relative;
			scroll-snap-align: center;
		}

		.featured-case {
			background-color: #2c2c2c;
			justify-content: center;
			align-items: center;
			aspect-ratio: 3/4;
			display: flex;
			position: relative;
			overflow: hidden;

			:global img {
				object-fit: cover;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
