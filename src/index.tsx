import { ImageResponse } from '@vercel/og';

const SPACE_GROTESK_URL =
  'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoL2vhfDFb4wWLE.woff2';

let spaceGroteskPromise: Promise<ArrayBuffer> | null = null;

async function loadSpaceGrotesk(): Promise<ArrayBuffer> {
  if (!spaceGroteskPromise) {
    spaceGroteskPromise = fetch(SPACE_GROTESK_URL).then((res) => res.arrayBuffer());
  }
  return spaceGroteskPromise;
}

type ParsedParams = {
  subject: string;
  timeLabel: string;
};

function parseParams(url: URL): ParsedParams {
  const rawPath = decodeURIComponent(url.pathname.replace(/^\/api\/?/, ''));
  const rawQuerySubject = url.searchParams.get('subject') ?? '';
  const pathSubject = rawPath.replace(/^subject:?/i, '').trim();
  const subject = (pathSubject || rawQuerySubject || 'Untitled post').slice(0, 180);

  const timeParam = url.searchParams.get('time');
  const timeLabel = formatTimeLabel(timeParam);

  return { subject, timeLabel };
}

function formatTimeLabel(timeParam: string | null): string {
  if (!timeParam) return 'Right now';
  const date = new Date(timeParam);
  if (Number.isNaN(date.valueOf())) {
    return timeParam;
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const handler: ExportedHandler = {
  async fetch(request) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api')) {
      return new Response('OG image generator ready. Use /api/<subject>?time=YYYY-MM-DD', {
        status: 200,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const { subject, timeLabel } = parseParams(url);
    const fontData = await loadSpaceGrotesk();

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px',
            background:
              'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.16), transparent 35%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.14), transparent 30%), linear-gradient(135deg, #0f172a 0%, #0b1220 45%, #0f172a 100%)',
            color: '#e2e8f0',
            fontFamily: 'Space Grotesk',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(750px at 0% 0%, rgba(56,189,248,0.12), transparent), radial-gradient(550px at 100% 0%, rgba(236,72,153,0.12), transparent)',
              filter: 'blur(40px)',
              opacity: 0.9,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 20px rgba(56,189,248,0.65)',
              }}
            />
            <span style={{ fontSize: '24px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Blog Visual
            </span>
          </div>

          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div
              style={{
                fontSize: subject.length > 48 ? '72px' : '84px',
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                maxWidth: '1000px',
              }}
            >
              {subject}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                width: 'fit-content',
                backdropFilter: 'blur(8px)',
                color: '#cbd5e1',
                fontSize: '28px',
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#f472b6',
                  boxShadow: '0 0 18px rgba(244,114,182,0.65)',
                }}
              />
              <span>Updated {timeLabel}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#94a3b8',
              fontSize: '24px',
              zIndex: 1,
            }}
          >
            <span>image-og • Cloudflare Worker + @vercel/og</span>
            <span>1200 × 630</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Space Grotesk',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );
  },
};

export default handler;
