// export default async function (to, from, savedPosition) {
// 	if (savedPosition) {
// 		return savedPosition;
// 	}

// 	const findEl = async (hash, x = 0) => {
// 		return (
// 			document && document.querySelector(hash) ||
// 			await new Promise((resolve) => {
// 				if (x > 50) {
// 					return resolve(document && document.querySelector('#app'));
// 				}
// 				setTimeout(() => resolve(findEl(hash, ++x || 1)), 100);
// 			})
// 		);
// 	};

// 	if (to.hash) {
// 		const el = await findEl(to.hash);
// 		if ('scrollBehavior' in document && document.documentElement.style) {
// 			return window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
// 		}
// 		else {
// 			return window.scrollTo(0, el.offsetTop);
// 		}
// 	}

// 	return { x: 0, y: 0 };
// }
