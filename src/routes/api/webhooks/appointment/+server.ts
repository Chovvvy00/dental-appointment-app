import { json } from '@sveltejs/kit';
// import { N8N_WEBHOOK_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const body = await request.json();

		// if (N8N_WEBHOOK_URL) {
			const res = await fetch("https://segonzales.app.n8n.cloud/webhook-test/appointment", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				console.error('Webhook responded with:', res.status, await res.text());
			}
		// }

		return json({ received: true });
	} catch (e) {
		console.error('Webhook error:', e);
		return json({ received: true });
	}
}







