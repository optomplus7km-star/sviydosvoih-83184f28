import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

export function HeartbeatHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Nodes
    const nodeCount = 18;
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 4 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const maxDist = 220;
    let time = 0;

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0A0E17');
      bg.addColorStop(1, '#001F3F');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Breathing factor (4-6s period)
      const breath = 0.85 + 0.15 * Math.sin(time * 1.3);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
      }

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const proximity = 1 - dist / maxDist;
            const alpha = proximity * 0.5 * breath;
            const lineW = 0.5 + proximity * 2;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(0, 191, 255, ${alpha})`);
            grad.addColorStop(1, `rgba(125, 227, 255, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = lineW;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (yellow firefly silhouettes)
      for (const n of nodes) {
        const glow = 0.7 + 0.3 * Math.sin(time * 2.5 + n.phase);
        const s = n.radius * breath;

        // Soft glow halo (minimal, no heavy blur)
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, s * 3);
        halo.addColorStop(0, `rgba(255, 215, 0, ${0.15 * glow})`);
        halo.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(n.x - s * 3, n.y - s * 3, s * 6, s * 6);

        // Person icon: head
        ctx.fillStyle = `rgba(255, 238, 0, ${0.7 + 0.3 * glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y - s * 0.6, s * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.arc(n.x, n.y + s * 0.4, s * 0.6, Math.PI, 0);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      <div className="kraken-container relative z-10 py-20 text-center mx-auto">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4 animate-fade-in tracking-tight"
            style={{ color: '#E0F2FE' }}>
          Мереживо
        </h1>
        <p className="text-lg sm:text-xl tracking-[0.3em] uppercase mb-12 animate-fade-in"
           style={{ color: 'rgba(125, 227, 255, 0.6)', animationDelay: '0.15s' }}>
          спільнота
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" className="gap-2 text-base px-8 bg-[#00BFFF]/20 border border-[#00BFFF]/40 text-[#E0F2FE] hover:bg-[#00BFFF]/30" asChild>
            <Link to="/catalog">
              <Compass className="h-5 w-5" />
              {t('hero', 'cta')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 text-base border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700]" asChild>
            <Link to="/signup">
              {t('hero', 'ctaSecondary')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
