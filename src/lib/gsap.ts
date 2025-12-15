import { browser } from '$app/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

if (browser) {
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable, InertiaPlugin);
}

export { gsap, ScrollTrigger, ScrollSmoother, Draggable, InertiaPlugin };
