const link = document.createElement('link');
Object.assign(link, {
	rel: 'stylesheet',
	href: import.meta.url.replace(/\.js$/, '.css')
});

document.head.appendChild(link);
