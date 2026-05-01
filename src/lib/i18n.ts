import { useCheckIn, type Language } from "@/context/CheckInContext";

type Dict = Record<string, string>;

const pt: Dict = {
  // Header / generic
  "common.back": "← Voltar",
  "common.continue": "Continuar →",
  "common.close": "Fechar",
  "common.cancel": "Cancelar",
  "common.loading": "Carregando",
  "common.or": "ou",
  "common.optional": "opcional",
  "common.skip_finish": "Pular · finalizar",
  "common.talk_reception": "Falar com a recepção",
  "common.back_home": "Voltar ao início",
  "common.try_again": "Tentar novamente",

  // Idle
  "idle.welcome": "BEM-VINDO",
  "idle.tap": "Toque para começar",
  "idle.subtitle": "Check-in em menos de 2 minutos",
  "idle.aria": "Toque para começar",

  // Language select
  "lang.title": "Selecione o idioma",
  "lang.subtitle": "Select language",

  // Menu
  "menu.title": "Como podemos ajudar?",
  "menu.checkin": "→ Fazer check-in",
  "menu.checkout": "Fazer check-out",
  "menu.info": "Informações do hotel",
  "menu.reception": "Chamar recepção",

  // Reservation
  "res.title": "Localizar reserva",
  "res.subtitle": "Digite uma das opções abaixo",
  "res.code_label": "Código da reserva",
  "res.doc_label": "CPF ou e-mail",
  "res.search": "Buscar reserva →",
  "res.no_code": "Não tenho código · ir à recepção",

  // Confirm
  "confirm.title": "Confirme seus dados",
  "confirm.guest": "Hóspede",
  "confirm.room": "Quarto",
  "confirm.stay": "Estadia",
  "confirm.ok": "Tudo certo · continuar",
  "confirm.wrong": "Algo está errado",

  // LGPD
  "lgpd.title": "Uso da sua imagem",
  "lgpd.intro": "Para fazer o check-in por reconhecimento facial precisamos:",
  "lgpd.item1": "Capturar uma foto sua agora no totem",
  "lgpd.item2": "Converter a foto em código numérico (vetor)",
  "lgpd.item3": "Apagar a foto após gerar o código",
  "lgpd.item4": "Apagar todos os dados em até 30 dias após o check-out",
  "lgpd.note": "Você pode pedir exclusão a qualquer momento na recepção.",
  "lgpd.accept": "Aceito e continuar",
  "lgpd.decline": "Não aceito · check-in na recepção",

  // Capture
  "cap.step": "PASSO 6 DE 6",
  "cap.title_1": "Olhe para",
  "cap.title_2": "a câmera",
  "cap.subtitle": "Vamos validar sua identidade. Captura automática.",
  "cap.unavailable": "Câmera indisponível",
  "cap.position": "Posicione seu rosto dentro do círculo",
  "cap.detecting": "Detectando rosto",
  "cap.capture_now": "Capturar agora",

  // Processing
  "proc.title": "Processando",
  "proc.subtitle": "Validando identidade e gerando sua chave digital",

  // Key
  "key.done": "CHECK-IN CONCLUÍDO",
  "key.welcome": "Bem-vindo,",
  "key.your_room": "SEU QUARTO",
  "key.floor": "{floor}º andar · ala {wing}",
  "key.digital_key": "CHAVE DIGITAL",
  "key.tap_door": "Aproxime no leitor da porta",
  "key.wifi": "Wi-Fi",
  "key.wifi_msg": "Senha enviada por e-mail",
  "key.finish": "Concluir",

  // Goodbye
  "bye.title": "Boa estadia!",
  "bye.subtitle": "Qualquer coisa, fale com a recepção ou volte ao totem.",
  "bye.countdown": "Voltando à tela inicial em {n}s",

  // Checkout identify
  "ci.title_1": "Olhe para",
  "ci.title_2": "a câmera",
  "ci.subtitle": "Vamos te identificar pelo rosto cadastrado no check-in.",
  "ci.identifying": "Identificando hóspede",
  "ci.use_code": "Não consigo · usar código da reserva",

  // Checkout summary
  "cs.title": "Resumo da estadia",
  "cs.subtitle": "V., quarto 412 · 28/04 a 02/05",
  "cs.nights": "Diárias (4 noites)",
  "cs.consumption": "Consumos",
  "cs.dispute": "Contestar item · falar com recepção",
  "cs.total": "Total",
  "cs.paid": "Já pago no cartão final 4242",

  // Checkout confirm
  "cc.title": "Confirmar saída?",
  "cc.intro": "Ao confirmar:",
  "cc.item1": "Sua chave digital será desativada",
  "cc.item2": "O quarto 412 será liberado para limpeza",
  "cc.item3": "O comprovante será enviado por e-mail",
  "cc.item4": "Seus dados biométricos serão apagados em 30 dias",
  "cc.warn_label": "Atenção:",
  "cc.warn": "deixou algo no quarto? Procure a recepção antes de confirmar.",
  "cc.confirm": "Confirmar saída",

  // Checkout rate
  "cr.done": "CHECK-OUT CONCLUÍDO",
  "cr.title": "Como foi sua estadia?",
  "cr.subtitle": "Opcional · leva 10 segundos",
  "cr.tap": "Toque nas estrelas",
  "cr.bad": "Ruim",
  "cr.great": "Excelente",
  "cr.comment": "Comentário (opcional)",
  "cr.send": "Enviar avaliação",
  "cr.aria_group": "Avaliação por estrelas",
  "cr.aria_star": "{n} estrela",
  "cr.aria_stars": "{n} estrelas",

  // Checkout goodbye
  "cb.title": "Boa viagem, {name}!",
  "cb.subtitle": "Comprovante enviado pro seu e-mail. Volte sempre.",

  // Errors
  "err.res.title": "Não encontramos sua reserva",
  "err.res.body": "Pode ser que o código tenha digitação diferente, ou a reserva esteja em outro nome.",
  "err.face.attempt": "TENTATIVA {n} DE {total}",
  "err.face.title": "Não conseguimos te identificar",
  "err.face.body": "Pode ser a iluminação ou o ângulo do rosto. Sem problema, vamos por outro caminho.",
  "err.face.use_code": "Usar código da reserva",
  "err.net.title": "Sem conexão no momento",
  "err.net.body": "Não conseguimos falar com o sistema do hotel agora. Por favor, faça seu check-in na recepção.",
  "err.gen.title": "Algo deu errado",
  "err.gen.body": "Tivemos um problema inesperado. A recepção já foi notificada.",
  "err.code": "Código do erro: {code}",

  // Accessibility
  "a11y.open": "Abrir painel de acessibilidade",
  "a11y.title": "Acessibilidade",
  "a11y.desc": "Ajuste a interface para suas preferências.",
  "a11y.font": "Tamanho do texto",
  "a11y.font_small": "Pequeno",
  "a11y.font_default": "Padrão",
  "a11y.font_large": "Grande",
  "a11y.font_aria": "Tamanho de texto {label}",
  "a11y.contrast": "Alto contraste",
  "a11y.libras": "Libras",
  "a11y.libras_btn": "Ativar avatar em Libras",
  "a11y.audio": "Áudio guiado",
  "a11y.audio_aria": "Áudio guiado",
  "a11y.todo": "Em desenvolvimento",
  "a11y.todo_desc": "Disponível na próxima versão.",

  // Keypad
  "kp.delete": "Apagar",
  "kp.confirm": "Confirmar",

  // Stay range
  "stay.range": "{from} a {to}/{year}",
};

const en: Dict = {
  "common.back": "← Back",
  "common.continue": "Continue →",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.loading": "Loading",
  "common.or": "or",
  "common.optional": "optional",
  "common.skip_finish": "Skip · finish",
  "common.talk_reception": "Talk to reception",
  "common.back_home": "Back to start",
  "common.try_again": "Try again",

  "idle.welcome": "WELCOME",
  "idle.tap": "Tap to begin",
  "idle.subtitle": "Check-in in under 2 minutes",
  "idle.aria": "Tap to begin",

  "lang.title": "Select language",
  "lang.subtitle": "Selecione o idioma",

  "menu.title": "How can we help?",
  "menu.checkin": "→ Check in",
  "menu.checkout": "Check out",
  "menu.info": "Hotel information",
  "menu.reception": "Call reception",

  "res.title": "Find reservation",
  "res.subtitle": "Enter one of the options below",
  "res.code_label": "Reservation code",
  "res.doc_label": "ID or e-mail",
  "res.search": "Search reservation →",
  "res.no_code": "I don't have a code · go to reception",

  "confirm.title": "Confirm your details",
  "confirm.guest": "Guest",
  "confirm.room": "Room",
  "confirm.stay": "Stay",
  "confirm.ok": "All correct · continue",
  "confirm.wrong": "Something is wrong",

  "lgpd.title": "Use of your image",
  "lgpd.intro": "To check in via face recognition we need to:",
  "lgpd.item1": "Capture a photo of you here at the kiosk",
  "lgpd.item2": "Convert the photo into a numeric code (vector)",
  "lgpd.item3": "Delete the photo after generating the code",
  "lgpd.item4": "Delete all data within 30 days of check-out",
  "lgpd.note": "You can request deletion at any time at reception.",
  "lgpd.accept": "Accept and continue",
  "lgpd.decline": "Don't accept · check in at reception",

  "cap.step": "STEP 6 OF 6",
  "cap.title_1": "Look at",
  "cap.title_2": "the camera",
  "cap.subtitle": "We'll validate your identity. Automatic capture.",
  "cap.unavailable": "Camera unavailable",
  "cap.position": "Place your face inside the circle",
  "cap.detecting": "Detecting face",
  "cap.capture_now": "Capture now",

  "proc.title": "Processing",
  "proc.subtitle": "Validating identity and generating your digital key",

  "key.done": "CHECK-IN COMPLETED",
  "key.welcome": "Welcome,",
  "key.your_room": "YOUR ROOM",
  "key.floor": "Floor {floor} · {wing} wing",
  "key.digital_key": "DIGITAL KEY",
  "key.tap_door": "Tap on the door reader",
  "key.wifi": "Wi-Fi",
  "key.wifi_msg": "Password sent by e-mail",
  "key.finish": "Finish",

  "bye.title": "Enjoy your stay!",
  "bye.subtitle": "Any need, talk to reception or come back to the kiosk.",
  "bye.countdown": "Returning to home in {n}s",

  "ci.title_1": "Look at",
  "ci.title_2": "the camera",
  "ci.subtitle": "We'll identify you by the face registered at check-in.",
  "ci.identifying": "Identifying guest",
  "ci.use_code": "Can't do it · use reservation code",

  "cs.title": "Stay summary",
  "cs.subtitle": "V., room 412 · 04/28 to 05/02",
  "cs.nights": "Nightly rate (4 nights)",
  "cs.consumption": "Consumption",
  "cs.dispute": "Dispute item · talk to reception",
  "cs.total": "Total",
  "cs.paid": "Already paid on card ending 4242",

  "cc.title": "Confirm checkout?",
  "cc.intro": "By confirming:",
  "cc.item1": "Your digital key will be deactivated",
  "cc.item2": "Room 412 will be released for cleaning",
  "cc.item3": "The receipt will be sent by e-mail",
  "cc.item4": "Your biometric data will be erased in 30 days",
  "cc.warn_label": "Warning:",
  "cc.warn": "did you leave anything in the room? Visit reception before confirming.",
  "cc.confirm": "Confirm checkout",

  "cr.done": "CHECK-OUT COMPLETED",
  "cr.title": "How was your stay?",
  "cr.subtitle": "Optional · takes 10 seconds",
  "cr.tap": "Tap the stars",
  "cr.bad": "Poor",
  "cr.great": "Excellent",
  "cr.comment": "Comment (optional)",
  "cr.send": "Send rating",
  "cr.aria_group": "Star rating",
  "cr.aria_star": "{n} star",
  "cr.aria_stars": "{n} stars",

  "cb.title": "Safe travels, {name}!",
  "cb.subtitle": "Receipt sent to your e-mail. Come back soon.",

  "err.res.title": "We couldn't find your reservation",
  "err.res.body": "The code may be slightly different, or the reservation may be under another name.",
  "err.face.attempt": "ATTEMPT {n} OF {total}",
  "err.face.title": "We couldn't identify you",
  "err.face.body": "It might be the lighting or the face angle. No problem, let's try another way.",
  "err.face.use_code": "Use reservation code",
  "err.net.title": "No connection right now",
  "err.net.body": "We can't reach the hotel system right now. Please check in at reception.",
  "err.gen.title": "Something went wrong",
  "err.gen.body": "We had an unexpected problem. Reception has been notified.",
  "err.code": "Error code: {code}",

  "a11y.open": "Open accessibility panel",
  "a11y.title": "Accessibility",
  "a11y.desc": "Adjust the interface to your preferences.",
  "a11y.font": "Text size",
  "a11y.font_small": "Small",
  "a11y.font_default": "Default",
  "a11y.font_large": "Large",
  "a11y.font_aria": "Text size {label}",
  "a11y.contrast": "High contrast",
  "a11y.libras": "Sign language",
  "a11y.libras_btn": "Enable sign language avatar",
  "a11y.audio": "Guided audio",
  "a11y.audio_aria": "Guided audio",
  "a11y.todo": "In development",
  "a11y.todo_desc": "Available in the next version.",

  "kp.delete": "Delete",
  "kp.confirm": "Confirm",

  "stay.range": "{from} to {to}/{year}",
};

const es: Dict = {
  "common.back": "← Volver",
  "common.continue": "Continuar →",
  "common.close": "Cerrar",
  "common.cancel": "Cancelar",
  "common.loading": "Cargando",
  "common.or": "o",
  "common.optional": "opcional",
  "common.skip_finish": "Saltar · finalizar",
  "common.talk_reception": "Hablar con recepción",
  "common.back_home": "Volver al inicio",
  "common.try_again": "Intentar de nuevo",

  "idle.welcome": "BIENVENIDO",
  "idle.tap": "Toca para comenzar",
  "idle.subtitle": "Check-in en menos de 2 minutos",
  "idle.aria": "Toca para comenzar",

  "lang.title": "Selecciona el idioma",
  "lang.subtitle": "Select language",

  "menu.title": "¿Cómo podemos ayudarte?",
  "menu.checkin": "→ Hacer check-in",
  "menu.checkout": "Hacer check-out",
  "menu.info": "Información del hotel",
  "menu.reception": "Llamar a recepción",

  "res.title": "Buscar reserva",
  "res.subtitle": "Ingresa una de las opciones abajo",
  "res.code_label": "Código de la reserva",
  "res.doc_label": "DNI o e-mail",
  "res.search": "Buscar reserva →",
  "res.no_code": "No tengo código · ir a recepción",

  "confirm.title": "Confirma tus datos",
  "confirm.guest": "Huésped",
  "confirm.room": "Habitación",
  "confirm.stay": "Estadía",
  "confirm.ok": "Todo correcto · continuar",
  "confirm.wrong": "Algo está mal",

  "lgpd.title": "Uso de tu imagen",
  "lgpd.intro": "Para hacer el check-in por reconocimiento facial necesitamos:",
  "lgpd.item1": "Capturar una foto tuya ahora en el tótem",
  "lgpd.item2": "Convertir la foto en un código numérico (vector)",
  "lgpd.item3": "Eliminar la foto después de generar el código",
  "lgpd.item4": "Eliminar todos los datos hasta 30 días tras el check-out",
  "lgpd.note": "Puedes pedir la eliminación en cualquier momento en recepción.",
  "lgpd.accept": "Acepto y continuar",
  "lgpd.decline": "No acepto · check-in en recepción",

  "cap.step": "PASO 6 DE 6",
  "cap.title_1": "Mira a",
  "cap.title_2": "la cámara",
  "cap.subtitle": "Vamos a validar tu identidad. Captura automática.",
  "cap.unavailable": "Cámara no disponible",
  "cap.position": "Coloca tu rostro dentro del círculo",
  "cap.detecting": "Detectando rostro",
  "cap.capture_now": "Capturar ahora",

  "proc.title": "Procesando",
  "proc.subtitle": "Validando identidad y generando tu llave digital",

  "key.done": "CHECK-IN COMPLETADO",
  "key.welcome": "Bienvenido,",
  "key.your_room": "TU HABITACIÓN",
  "key.floor": "Piso {floor} · ala {wing}",
  "key.digital_key": "LLAVE DIGITAL",
  "key.tap_door": "Acerca al lector de la puerta",
  "key.wifi": "Wi-Fi",
  "key.wifi_msg": "Contraseña enviada por e-mail",
  "key.finish": "Finalizar",

  "bye.title": "¡Buena estadía!",
  "bye.subtitle": "Cualquier cosa, habla con recepción o vuelve al tótem.",
  "bye.countdown": "Volviendo al inicio en {n}s",

  "ci.title_1": "Mira a",
  "ci.title_2": "la cámara",
  "ci.subtitle": "Te identificaremos por el rostro registrado en el check-in.",
  "ci.identifying": "Identificando huésped",
  "ci.use_code": "No puedo · usar código de reserva",

  "cs.title": "Resumen de la estadía",
  "cs.subtitle": "V., habitación 412 · 28/04 al 02/05",
  "cs.nights": "Diarias (4 noches)",
  "cs.consumption": "Consumos",
  "cs.dispute": "Disputar ítem · hablar con recepción",
  "cs.total": "Total",
  "cs.paid": "Ya pagado en la tarjeta final 4242",

  "cc.title": "¿Confirmar salida?",
  "cc.intro": "Al confirmar:",
  "cc.item1": "Tu llave digital será desactivada",
  "cc.item2": "La habitación 412 será liberada para limpieza",
  "cc.item3": "El comprobante se enviará por e-mail",
  "cc.item4": "Tus datos biométricos se eliminarán en 30 días",
  "cc.warn_label": "Atención:",
  "cc.warn": "¿olvidaste algo en la habitación? Pasa por recepción antes de confirmar.",
  "cc.confirm": "Confirmar salida",

  "cr.done": "CHECK-OUT COMPLETADO",
  "cr.title": "¿Cómo fue tu estadía?",
  "cr.subtitle": "Opcional · toma 10 segundos",
  "cr.tap": "Toca las estrellas",
  "cr.bad": "Malo",
  "cr.great": "Excelente",
  "cr.comment": "Comentario (opcional)",
  "cr.send": "Enviar evaluación",
  "cr.aria_group": "Calificación por estrellas",
  "cr.aria_star": "{n} estrella",
  "cr.aria_stars": "{n} estrellas",

  "cb.title": "¡Buen viaje, {name}!",
  "cb.subtitle": "Comprobante enviado a tu e-mail. Vuelve pronto.",

  "err.res.title": "No encontramos tu reserva",
  "err.res.body": "Puede ser que el código tenga otra grafía, o la reserva esté a otro nombre.",
  "err.face.attempt": "INTENTO {n} DE {total}",
  "err.face.title": "No pudimos identificarte",
  "err.face.body": "Puede ser la iluminación o el ángulo del rostro. No te preocupes, vamos por otro camino.",
  "err.face.use_code": "Usar código de la reserva",
  "err.net.title": "Sin conexión en este momento",
  "err.net.body": "No podemos contactar al sistema del hotel ahora. Por favor, haz tu check-in en recepción.",
  "err.gen.title": "Algo salió mal",
  "err.gen.body": "Tuvimos un problema inesperado. Recepción ya fue notificada.",
  "err.code": "Código del error: {code}",

  "a11y.open": "Abrir panel de accesibilidad",
  "a11y.title": "Accesibilidad",
  "a11y.desc": "Ajusta la interfaz a tus preferencias.",
  "a11y.font": "Tamaño del texto",
  "a11y.font_small": "Pequeño",
  "a11y.font_default": "Estándar",
  "a11y.font_large": "Grande",
  "a11y.font_aria": "Tamaño de texto {label}",
  "a11y.contrast": "Alto contraste",
  "a11y.libras": "Lengua de señas",
  "a11y.libras_btn": "Activar avatar en lengua de señas",
  "a11y.audio": "Audio guiado",
  "a11y.audio_aria": "Audio guiado",
  "a11y.todo": "En desarrollo",
  "a11y.todo_desc": "Disponible en la próxima versión.",

  "kp.delete": "Borrar",
  "kp.confirm": "Confirmar",

  "stay.range": "{from} al {to}/{year}",
};

const dicts: Record<Language, Dict> = { pt, en, es };

export const translate = (
  lang: Language,
  key: string,
  vars?: Record<string, string | number>
): string => {
  const raw = dicts[lang]?.[key] ?? dicts.pt[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  );
};

export const useT = () => {
  const { language } = useCheckIn();
  return (key: string, vars?: Record<string, string | number>) =>
    translate(language, key, vars);
};
