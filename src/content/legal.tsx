import type { ReactNode } from "react"

import type { Locale } from "@/lib/i18n/config"
import { sellerLine } from "@/lib/seller"
import { site } from "@/lib/site"

type LegalDoc = { title: string; updated: string; body: ReactNode }

const UPDATED = { ru: "Обновлено 28 сентября 2026", en: "Updated September 28, 2026" }

const mail = site.supportEmail ? (
  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
) : (
  <span>[NEXT_PUBLIC_SUPPORT_EMAIL]</span>
)
const policyLink = (text: string) => (
  <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">
    {text}
  </a>
)
const permissionsLink = (
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">
    myaccount.google.com/permissions
  </a>
)

export function privacy(locale: Locale): LegalDoc {
  if (locale === "ru") {
    return {
      title: "Политика конфиденциальности",
      updated: UPDATED.ru,
      body: (
        <>
          <p>
            Здесь описано, какие данные собирает Airletter (сайт и расширение для Chrome), зачем, где они хранятся и
            как их удалить.
          </p>

          <h2>Какие данные мы получаем</h2>
          <ul>
            <li>
              Данные аккаунта: email или номер телефона и имя. Пароль хранится только в виде необратимого хеша
              (bcrypt).
            </li>
            <li>Данные подключённого аккаунта Google: адрес Gmail, имя, фото профиля — когда вы подключаете Gmail.</li>
            <li>
              Токены доступа Google. Хранятся в зашифрованном виде и используются только для отправки писем и чтения
              выбранных вами таблиц.
            </li>
            <li>
              Данные кампаний: тема, текст письма, вложения, адреса получателей и статусы отправки.
            </li>
            <li>
              Данные об оплате: тариф, сумма, статус платежа. Данные карт мы не получаем и не храним — платежи
              обрабатывают ЮKassa и Stripe.
            </li>
            <li>Технические журналы сервера (IP-адрес, время запроса) — для безопасности и диагностики.</li>
          </ul>

          <h2>Доступ к данным Google</h2>
          <p>Airletter запрашивает только необходимые разрешения:</p>
          <ul>
            <li>
              <b>Отправка писем от вашего имени</b> (gmail.send) — чтобы отправлять письма кампании с вашего адреса. Мы
              не читаем, не изменяем и не удаляем письма в вашем ящике.
            </li>
            <li>
              <b>Чтение Google Таблиц</b> — чтобы получить адреса получателей из таблицы, которую вы указали.
            </li>
            <li>
              <b>Базовый профиль Google</b> (email, имя) — чтобы показать, с какого адреса уходят письма.
            </li>
          </ul>
          <p>
            Использование и передача Airletter информации, полученной через Google API, в любое другое приложение
            соответствует {policyLink("Google API Services User Data Policy")}, включая требования Limited Use. В
            частности: данные Google используются только для работы функций, которые вы видите в продукте; не
            используются для рекламы; не продаются; не передаются третьим лицам, кроме случаев, необходимых для работы
            сервиса или требуемых законом; сотрудники не читают их без вашего явного согласия, кроме случаев
            безопасности и требований закона; данные не используются для обучения общих моделей ИИ.
          </p>

          <h2>Кому мы передаём данные</h2>
          <p>
            Мы не продаём данные и не передаём их рекламным платформам. Данные обрабатывают только поставщики, без
            которых сервис не работает: хостинг-провайдер, Google (отправка писем через Gmail API), ЮKassa и Stripe
            (приём платежей).
          </p>

          <h2>Хранение и защита</h2>
          <p>
            Данные передаются только по HTTPS. Токены Google шифруются (AES-256-GCM). Данные кампаний хранятся, пока
            существует ваш аккаунт или до удаления по вашему запросу.
          </p>

          <h2>Cookie</h2>
          <p>
            Сайт использует только технические cookie: для входа в аккаунт и запоминания языка. Рекламных и
            аналитических cookie нет.
          </p>

          <h2>Ваши права</h2>
          <ul>
            <li>Запросить копию своих данных или их удаление — напишите на {mail}. Мы выполним запрос в течение 30 дней.</li>
            <li>Отозвать доступ Airletter к аккаунту Google в любой момент: {permissionsLink}.</li>
          </ul>

          <h2>Контакты</h2>
          <p>
            По вопросам обработки данных: {mail}.
            {sellerLine() && <> Оператор персональных данных: {sellerLine()}.</>}
          </p>
        </>
      ),
    }
  }

  return {
    title: "Privacy Policy",
    updated: UPDATED.en,
    body: (
      <>
        <p>
          This policy explains what data Airletter (the website and the Chrome extension) collects, why, where it is
          stored and how to delete it.
        </p>

        <h2>Data we receive</h2>
        <ul>
          <li>
            Account data: email address or phone number and name. Passwords are stored only as an irreversible hash
            (bcrypt).
          </li>
          <li>Connected Google account data: Gmail address, name, profile picture — when you connect Gmail.</li>
          <li>
            Google access tokens. Stored encrypted and used only to send email and read the spreadsheets you select.
          </li>
          <li>Campaign data: subject, body, attachments, recipient addresses and delivery statuses.</li>
          <li>
            Payment data: plan, amount, payment status. We never receive or store card details — payments are
            processed by YooKassa and Stripe.
          </li>
          <li>Server logs (IP address, request time) — for security and troubleshooting.</li>
        </ul>

        <h2>Access to Google data</h2>
        <p>Airletter only requests the permissions it needs:</p>
        <ul>
          <li>
            <b>Send email on your behalf</b> (gmail.send) — to send campaign emails from your address. We do not read,
            modify or delete messages in your mailbox.
          </li>
          <li>
            <b>Read Google Sheets</b> — to load recipient addresses from the spreadsheet you point to.
          </li>
          <li>
            <b>Basic Google profile</b> (email, name) — to show which address your emails are sent from.
          </li>
        </ul>
        <p>
          Airletter&apos;s use and transfer of information received from Google APIs to any other app will adhere to{" "}
          {policyLink("Google API Services User Data Policy")}, including the Limited Use requirements. In particular,
          Google user data is only used to provide user-facing features of Airletter; is never used for advertising;
          is never sold; is not transferred to third parties except as necessary to provide the service or required by
          law; is not read by humans without your explicit consent, except for security purposes or to comply with the
          law; and is not used to train generalized AI models.
        </p>

        <h2>Who we share data with</h2>
        <p>
          We do not sell data or share it with advertising platforms. Data is processed only by providers the service
          cannot work without: our hosting provider, Google (sending via the Gmail API), YooKassa and Stripe (payments).
        </p>

        <h2>Storage and security</h2>
        <p>
          Data is transmitted over HTTPS only. Google tokens are encrypted (AES-256-GCM). Campaign data is kept while
          your account exists or until you ask us to delete it.
        </p>

        <h2>Cookies</h2>
        <p>
          The site only uses essential cookies: to keep you signed in and to remember your language. No advertising or
          analytics cookies.
        </p>

        <h2>Your rights</h2>
        <ul>
          <li>Request a copy of your data or its deletion — email {mail}. We handle requests within 30 days.</li>
          <li>Revoke Airletter&apos;s access to your Google account at any time: {permissionsLink}.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          Data protection questions: {mail}.
        </p>
      </>
    ),
  }
}

export function terms(locale: Locale): LegalDoc {
  if (locale === "ru") {
    return {
      title: "Условия использования",
      updated: UPDATED.ru,
      body: (
        <>
          <p>
            Используя Airletter, вы принимаете эти условия. Они являются публичной офертой на оказание услуг по
            предоставлению доступа к сервису.
          </p>

          <h2>Сервис</h2>
          <p>
            Airletter — расширение для Chrome и личный кабинет на сайте, которые позволяют отправлять рассылки из
            вашего аккаунта Gmail через Gmail API. Письма уходят с вашего адреса и подчиняются правилам и лимитам
            Google.
          </p>

          <h2>Допустимое использование</h2>
          <ul>
            <li>Отправляйте письма только тем, кто согласился их получать, или с кем у вас есть деловые отношения.</li>
            <li>
              Соблюдайте законодательство о рекламе и персональных данных (в том числе 38-ФЗ «О рекламе», 152-ФЗ,
              GDPR, CAN-SPAM).
            </li>
            <li>Запрещены спам, фишинг, вредоносные вложения, обман получателей и попытки обойти лимиты Gmail.</li>
          </ul>
          <p>
            Мы можем приостановить доступ при нарушении этих правил. Google может ограничить ваш аккаунт Gmail
            независимо от нас.
          </p>

          <h2>Тарифы и оплата</h2>
          <ul>
            <li>Пробный период — 10 дней, до 50 писем в день, бесплатно.</li>
            <li>
              Платные тарифы оплачиваются заранее за месяц или за год через ЮKassa или Stripe. Автоматического
              продления нет.
            </li>
            <li>
              Фактический дневной объём ограничен лимитами Gmail: около 500 писем для обычного аккаунта и около 2000
              для Google Workspace.
            </li>
            <li>
              Если вы не отправили ни одного письма в оплаченном периоде, в течение 14 дней после оплаты можно
              запросить полный возврат на {mail}.
            </li>
          </ul>

          <h2>Ответственность</h2>
          <p>
            Сервис предоставляется «как есть». Мы не отвечаем за доставку в конкретный почтовый ящик, решения
            спам-фильтров и ограничения, наложенные Google на ваш аккаунт. Ответственность за содержание писем и
            законность рассылки несёт пользователь.
          </p>

          <h2>Изменения</h2>
          <p>Мы можем обновлять условия. О существенных изменениях сообщим по email заранее.</p>

          <h2>Контакты</h2>
          <p>
            {mail}
            {sellerLine() && <>. Исполнитель: {sellerLine()}</>}
          </p>
        </>
      ),
    }
  }

  return {
    title: "Terms of Service",
    updated: UPDATED.en,
    body: (
      <>
        <p>By using Airletter you agree to these terms.</p>

        <h2>The service</h2>
        <p>
          Airletter is a Chrome extension and a web dashboard that let you send campaigns from your Gmail account via
          the Gmail API. Emails are sent from your address and are subject to Google&apos;s rules and limits.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Only email people who agreed to receive your messages or with whom you have a business relationship.</li>
          <li>Comply with applicable anti-spam and data protection laws (including CAN-SPAM and GDPR).</li>
          <li>Spam, phishing, malicious attachments, deceiving recipients and circumventing Gmail limits are prohibited.</li>
        </ul>
        <p>
          We may suspend access for violations. Google may restrict your Gmail account independently of us.
        </p>

        <h2>Plans and payment</h2>
        <ul>
          <li>The trial lasts 10 days with up to 50 emails a day, free of charge.</li>
          <li>Paid plans are prepaid for a month or a year via YooKassa or Stripe. They do not renew automatically.</li>
          <li>
            Actual daily volume is capped by Gmail limits: about 500 emails for a regular account and about 2,000 for
            Google Workspace.
          </li>
          <li>
            If you have not sent any email in the paid period, you can request a full refund within 14 days of payment
            at {mail}.
          </li>
        </ul>

        <h2>Liability</h2>
        <p>
          The service is provided &quot;as is&quot;. We are not responsible for delivery to a particular inbox, spam
          filter decisions or restrictions Google places on your account. You are responsible for the content of your
          emails and the lawfulness of your campaigns.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms and will notify you by email about material changes in advance.</p>

        <h2>Contact</h2>
        <p>
          {mail}
        </p>
      </>
    ),
  }
}
