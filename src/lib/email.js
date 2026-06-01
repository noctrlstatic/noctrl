import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "NOCTRL Shop <onboarding@resend.dev>";
const OWNER = process.env.EMAIL_OWNER || "noctrlshop@email.com";

function formatItems(items) {
  return items
    .map((i) => `  ${i.name} × ${i.cartQty} — €${(Number(i.price) * i.cartQty).toFixed(2)}`)
    .join("\n");
}

export async function sendCustomerConfirmation({ email, name, orderId, items, total }) {
  if (!resend) return console.warn("⚠️ RESEND_API_KEY non impostato");

  const itemsText = formatItems(items);

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Ordine #${orderId} confermato — NOCTRL`,
      text: `Ciao ${name || "cliente"},\n\nGrazie per il tuo ordine!\n\nOrdine #${orderId}\n\n${itemsText}\n\nTotale: €${Number(total).toFixed(2)}\n\nRiceverai un aggiornamento quando l'ordine verrà spedito.\n\n— NOCTRL`,
    });
    console.log(`📧 Conferma inviata a ${email} per ordine #${orderId}`);
  } catch (err) {
    console.error("❌ Errore invio conferma cliente:", err);
  }
}

export async function sendOwnerNotification({ orderId, customerEmail, items, total }) {
  if (!resend) return console.warn("⚠️ RESEND_API_KEY non impostato");

  const itemsText = formatItems(items);

  try {
    await resend.emails.send({
      from: FROM,
      to: OWNER,
      subject: `🛒 Nuovo ordine #${orderId} — NOCTRL`,
      text: `Nuovo ordine ricevuto!\n\nOrdine #${orderId}\nCliente: ${customerEmail}\n\n${itemsText}\n\nTotale: €${Number(total).toFixed(2)}\n\nVai su https://noctrl-store.vercel.app/admin per gestirlo.`,
    });
    console.log(`📧 Notifica owner inviata per ordine #${orderId}`);
  } catch (err) {
    console.error("❌ Errore notifica owner:", err);
  }
}
