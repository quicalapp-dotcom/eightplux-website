import { NextResponse } from 'next/server';

const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, email, items } = body;

        const response = await fetch('https://api.commerce.coinbase.com/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CC-Api-Key': COINBASE_API_KEY || '',
                'X-CC-Version': '2018-03-22',
            },
            body: JSON.stringify({
                name: 'EIGHTPLUX Order',
                description: `Purchase of ${items.length} items`,
                pricing_type: 'fixed_price',
                local_price: {
                    amount: amount.toString(),
                    currency: currency,
                },
                metadata: {
                    customer_email: email,
                },
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
            }),
        });

        const data = await response.json();

        if (data.data && data.data.hosted_url) {
            return NextResponse.json({ hosted_url: data.data.hosted_url });
        } else {
            console.error('Coinbase error:', data);
            return NextResponse.json({ error: 'Failed to create charge' }, { status: 500 });
        }
    } catch (error) {
        console.error('Crypto charge creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
