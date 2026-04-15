export const SITE_URL = 'https://gavesh.live';
export const SITE_NAME = 'Gavesh Saparamadu';
export const SITE_TITLE_DEFAULT = 'Gavesh Saparamadu | Portfolio';
export const SITE_DESCRIPTION_DEFAULT =
	'Portfolio of Gavesh Saparamadu, featuring projects, skills, links, and live listening stats.';
export const SITE_OG_IMAGE = `${SITE_URL}/favicon.png`;

export type RouteSeo = {
	title: string;
	description: string;
};

export const ROUTE_SEO: Record<string, RouteSeo> = {
	'/': {
		title: 'Gavesh Saparamadu | Portfolio',
		description:
			'Personal website of Gavesh Saparamadu with focused overview, identity, and live activity signals.'
	},
	'/projects': {
		title: 'Projects | Gavesh Saparamadu',
		description:
			'Selected projects by Gavesh Saparamadu including current builds, stack details, and live links.'
	},
	'/skills': {
		title: 'Skills | Gavesh Saparamadu',
		description:
			'Technical skills grouped by languages, frontend stack, and development tools used by Gavesh Saparamadu.'
	},
	'/music': {
		title: 'Music Stats | Gavesh Saparamadu',
		description:
			'Top listening stats and track rankings from recent activity, integrated into the portfolio experience.'
	},
	'/links': {
		title: 'Links | Gavesh Saparamadu',
		description: 'External links and destinations related to Gavesh Saparamadu and active projects.'
	}
};
