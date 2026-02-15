import { NextRequest, NextResponse } from "next/server";

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET || "0x0000000000000000000000000000000000000000";

// Rate limiting store (en mémoire, à remplacer par Redis en production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    // Nouveau client ou limite réinitialisée
    rateLimitStore.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 heure
    return true;
  }

  if (limit.count >= 5) {
    // Max 5 contributions par heure
    return false;
  }

  limit.count++;
  return true;
}

async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `response=${token}&secret=${HCAPTCHA_SECRET}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

function sanitizeInput(input: string): string {
  return input.trim().substring(0, 1000);
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez réessayer dans 1 heure." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { captchaToken, scholarFrom, scholarTo, summary } = body;

    // Valider le captcha
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha requis" },
        { status: 400 }
      );
    }

    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "Vérification captcha échouée" },
        { status: 400 }
      );
    }

    // Valider les champs requis
    if (!scholarFrom || !scholarTo || !summary) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Sanitiser les inputs
    const sanitizedFrom = sanitizeInput(scholarFrom);
    const sanitizedTo = sanitizeInput(scholarTo);
    const sanitizedSummary = sanitizeInput(summary);

    // Vérifier les contenus suspects
    const suspiciousPatterns = [
      /javascript:/i,
      /<script/i,
      /onclick/i,
      /onerror/i,
      /eval\(/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (
        pattern.test(sanitizedFrom) ||
        pattern.test(sanitizedTo) ||
        pattern.test(sanitizedSummary)
      ) {
        return NextResponse.json(
          { error: "Contenu invalide détecté" },
          { status: 400 }
        );
      }
    }

    // Log la contribution (pour la modération manuelle)
    console.log(`[CONTRIBUTION] IP: ${ip}, From: ${sanitizedFrom}, To: ${sanitizedTo}`);

    return NextResponse.json(
      { success: true, message: "Contribution reçue et en attente de modération" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
