import { getEntry } from 'astro:content';
import { ImageResponse } from 'workers-og';
import InterBoldData from '../../../assets/fonts/Inter-Bold.ttf';
import InterMediumData from '../../../assets/fonts/Inter-Medium.ttf';
import InterRegularData from '../../../assets/fonts/Inter-Regular.ttf';

interface Props {
	params: {
		slug?: string;
	};
}

const formatDate = (date: Date | string) =>
	new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
		new Date(date),
	);

const escape = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export async function GET({ params }: Props) {
	const slug = params.slug;

	if (!slug) {
		return new Response('Slug parameter is required', { status: 400 });
	}

	const post = await getEntry('blog', slug);

	if (!post) {
		return new Response('Blog post not found', { status: 404 });
	}

	const { title, description, pubDate } = post.data;

	const html = `
    <div style="width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: space-between; padding: 64px; background: radial-gradient(circle at 20% 20%, #1f2d4f 0, #0b1221 45%), radial-gradient(circle at 80% 30%, #223559 0, rgba(11, 18, 33, 0.6) 40%), #0b1221; color: #f6f9ff; font-family: 'Inter'; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; color: #92b4ff; font-size: 28px; letter-spacing: 1px; font-weight: 600;">
        <span>Image OG · Blog</span>
        <span>${escape(formatDate(pubDate))}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <h1 style="font-size: 64px; line-height: 1.05; margin: 0; max-width: 940px; font-weight: 700; letter-spacing: -0.5px;">${escape(
					title,
				)}</h1>
        <p style="font-size: 28px; line-height: 1.4; margin: 0; max-width: 940px; color: #d7def1; font-weight: 500;">${escape(
					description,
				)}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #b9c9ec; font-weight: 500;">
        <div style="width: 12px; height: 12px; border-radius: 999px; background: #64d2ff; box-shadow: 0 0 0 4px rgba(100, 210, 255, 0.25);"></div>
        <span>peteryang · image-og</span>
      </div>
    </div>
  `;

	return new ImageResponse(html, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: InterBoldData, weight: 700, style: 'normal' },
			{ name: 'Inter', data: InterMediumData, weight: 500, style: 'normal' },
			{ name: 'Inter', data: InterRegularData, weight: 400, style: 'normal' },
		],
		debug: false,
	});
}
