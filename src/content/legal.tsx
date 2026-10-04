import Link from "next/link"
import type { ReactNode } from "react"

import type { Locale } from "@/lib/i18n/config"
import { sellerLine } from "@/lib/seller"
import { site } from "@/lib/site"

type LegalDoc = { title: string; updated: string; body: ReactNode }

const UPDATED = { ru: "Обновлено 4 октября 2026", en: "Last updated October 4, 2026" }

// Unset settings show the variable name, so a missing value is caught before launch
const setting = (value: string, env: string) => value || <span>[{env}]</span>

const mail = site.supportEmail ? (
  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
) : (
  <span>[NEXT_PUBLIC_SUPPORT_EMAIL]</span>
)
const operator = (locale: Locale) => setting(sellerLine(locale), "NEXT_PUBLIC_SELLER_NAME / NEXT_PUBLIC_SELLER_INN")
const address = setting(site.seller.address, "NEXT_PUBLIC_SELLER_ADDRESS")
const hosting = setting(site.dataHosting, "NEXT_PUBLIC_DATA_HOSTING")

const link = (href: string, text: string) => (
  <a href={href} target="_blank" rel="noopener">
    {text}
  </a>
)
const userDataPolicy = link(
  "https://developers.google.com/terms/api-services-user-data-policy",
  "Google API Services User Data Policy",
)
const workspacePolicy = link(
  "https://developers.google.com/workspace/workspace-api-user-data-developer-policy",
  "Google Workspace API User Data and Developer Policy",
)
const gmailPolicies = link("https://www.google.com/gmail/about/policy/", "Gmail Program Policies")
const permissionsLink = link("https://myaccount.google.com/permissions", "myaccount.google.com/permissions")

// The Limited Use statement must be quoted word for word, in English
const limitedUse = (
  <blockquote>
    Airletter’s use and transfer to any other app of information received from Google APIs will adhere to{" "}
    {userDataPolicy}, including the Limited Use requirements. The use of information received from Google Workspace
    scopes will adhere to the {workspacePolicy}, including the Limited Use requirements.
  </blockquote>
)

export function privacy(locale: Locale): LegalDoc {
  if (locale === "ru") {
    return {
      title: "Политика конфиденциальности",
      updated: UPDATED.ru,
      body: (
        <>
          <p>
            Политика описывает, какие данные обрабатывает Airletter — сайт, личный кабинет и расширение для Chrome
            (вместе — «сервис»), зачем, где они хранятся, кому передаются и как их удалить. Отдельно описано, как мы
            работаем с данными, полученными от Google.
          </p>

          <h2>1. Оператор</h2>
          <p>
            Оператор персональных данных: {operator("ru")}. Адрес: {address}. Связаться по любым вопросам о данных:{" "}
            {mail}.
          </p>

          <h2>2. Какие данные мы получаем</h2>
          <h3>Аккаунт Airletter</h3>
          <ul>
            <li>Email и имя, которые вы указываете при регистрации.</li>
            <li>Пароль — только в виде необратимого хеша (bcrypt); сам пароль мы не храним и не видим.</li>
          </ul>

          <h3>Данные Google — только когда вы подключаете Gmail</h3>
          <p>Airletter запрашивает следующие разрешения (scopes) и получает по ним только это:</p>
          <ul>
            <li>
              <b>openid, userinfo.email, userinfo.profile</b> — адрес Google-аккаунта, имя и фото профиля. Нужны, чтобы
              показать, с какого адреса уходят письма, и подставить его в поле «От».
            </li>
            <li>
              <b>gmail.send</b> — право отправлять письма от вашего имени. Airletter только отправляет письма, которые
              вы сами составили и запустили. Мы <b>не читаем</b> входящие и отправленные, не получаем список писем,
              контакты и метаданные ящика, ничего не изменяем и не удаляем — это разрешение такого доступа не даёт.
            </li>
            <li>
              <b>spreadsheets.readonly</b> — чтение Google Таблицы, которую вы указали при импорте получателей. Мы
              читаем только заданный вами диапазон в момент импорта и сохраняем из него лишь адреса email из первой
              колонки. Остальное содержимое таблицы не сохраняется. Другие ваши файлы мы не открываем.
            </li>
            <li>
              <b>OAuth-токены</b> Google, которые позволяют выполнять действия выше. Хранятся в зашифрованном виде.
            </li>
          </ul>

          <h3>Кампании</h3>
          <ul>
            <li>
              Тема, текст письма (HTML или простой текст), вложения и встроенные изображения, адреса получателей,
              расписание.
            </li>
            <li>
              Журнал отправки: статус по каждому получателю, время, идентификатор отправленного письма в Gmail, текст
              ошибки, если письмо не ушло.
            </li>
          </ul>

          <h3>Оплата</h3>
          <ul>
            <li>
              Тариф, сумма, валюта, статус и идентификатор платежа. Данные банковских карт мы не получаем и не храним —
              их обрабатывают ЮKassa и Stripe на своих страницах.
            </li>
          </ul>

          <h3>Технические данные</h3>
          <ul>
            <li>Журналы сервера: IP-адрес, время и адрес запроса, код ответа — для безопасности и диагностики.</li>
            <li>
              В браузере расширение хранит токены входа в Airletter и импортированные списки получателей (хранилище
              расширения Chrome, на вашем устройстве).
            </li>
          </ul>

          <h2>3. Как мы используем данные</h2>
          <p>Только для работы функций, которые вы видите в сервисе:</p>
          <ul>
            <li>вход в аккаунт и его защита;</li>
            <li>отправка ваших кампаний через ваш Gmail в соблюдение дневных лимитов;</li>
            <li>импорт получателей из выбранной вами таблицы;</li>
            <li>показ статуса и статистики кампаний в кабинете и расширении;</li>
            <li>приём оплаты и учёт тарифа, выполнение требований налогового законодательства;</li>
            <li>ответы на ваши обращения в поддержку.</li>
          </ul>
          <p>
            Мы не используем данные для рекламы, не строим профили пользователей и не продаём данные. Писем вашим
            получателям от себя мы не отправляем.
          </p>

          <h2>4. Данные Google и требования Limited Use</h2>
          <p>Использование и передача информации, полученной из Google API, соответствуют политике Google:</p>
          {limitedUse}
          <p>В частности:</p>
          <ul>
            <li>данные Google используются только для функций Airletter, описанных выше и видимых вам в интерфейсе;</li>
            <li>данные Google не используются для показа рекламы, в том числе персонализированной и ретаргетинга;</li>
            <li>данные Google не продаются и не передаются брокерам данных и рекламным платформам;</li>
            <li>
              данные Google передаются третьим лицам только для работы сервиса (см. раздел 7), по требованию закона или
              при реорганизации, слиянии или продаже сервиса — и только с вашего предварительного согласия;
            </li>
            <li>
              люди не читают ваши данные Google, кроме случаев: вы дали явное согласие на конкретный случай (например,
              при обращении в поддержку); это нужно для расследования злоупотреблений и безопасности; этого требует
              закон; данные агрегированы и обезличены для внутренней работы сервиса;
            </li>
            <li>
              Airletter не использует данные, полученные через Google Workspace API, для разработки, улучшения или
              обучения обобщённых моделей искусственного интеллекта и машинного обучения ({workspacePolicy}).
            </li>
          </ul>

          <h2>5. Правовые основания</h2>
          <ul>
            <li>исполнение договора (условия использования): аккаунт, отправка кампаний, оплата;</li>
            <li>ваше согласие: подключение Gmail и выдача разрешений Google — его можно отозвать в любой момент;</li>
            <li>законный интерес: безопасность сервиса и предотвращение злоупотреблений (журналы сервера);</li>
            <li>исполнение закона: хранение сведений о платежах и чеков.</li>
          </ul>
          <p>
            Регистрируясь, вы даёте согласие на обработку персональных данных на условиях этой политики в соответствии с
            Федеральным законом № 152-ФЗ «О персональных данных».
          </p>

          <h2>6. Где и как хранятся данные</h2>
          <ul>
            <li>Сервер и база данных: {hosting}. Сайт размещён на Vercel.</li>
            <li>Все соединения — только по HTTPS (TLS).</li>
            <li>
              OAuth-токены Google шифруются при хранении (AES-256-GCM), пароли хранятся как хеш bcrypt, токены сессий —
              в cookie, недоступных скриптам страницы.
            </li>
            <li>Доступ к серверам и базе есть только у оператора.</li>
          </ul>
          <h3>Сроки хранения</h3>
          <ul>
            <li>аккаунт, кампании и журнал отправки — пока существует аккаунт, либо до удаления по вашему запросу;</li>
            <li>
              токены Google — до отключения Gmail в кабинете или отзыва доступа в аккаунте Google; при отключении токен
              сразу отзывается у Google и удаляется;
            </li>
            <li>сведения о платежах — в течение срока, установленного налоговым законодательством;</li>
            <li>журналы сервера — ограниченное время, необходимое для безопасности и диагностики.</li>
          </ul>

          <h2>7. Кому мы передаём данные</h2>
          <p>Только поставщикам, без которых сервис не работает, и в объёме, необходимом для их задачи:</p>
          <ul>
            <li>хостинг сервера и базы данных — {hosting};</li>
            <li>Vercel Inc. (США) — размещение сайта;</li>
            <li>Google LLC (США) — отправка писем через Gmail API и чтение выбранных таблиц по вашему поручению;</li>
            <li>ООО НКО «ЮMoney» (ЮKassa, Россия) — приём платежей в рублях;</li>
            <li>Stripe, Inc. (США) и Stripe Payments Europe, Ltd. (Ирландия) — приём платежей в долларах.</li>
          </ul>
          <p>
            Данные Google не передаются платёжным системам и другим третьим лицам. Аналитических и рекламных сервисов
            сервис не использует.
          </p>

          <h2>8. Трансграничная передача</h2>
          <p>
            Часть поставщиков (Google, Vercel, Stripe) находится за пределами России и ЕС. Передача выполняется только
            для оказания услуги, а поставщики защищают данные по своим стандартам и договорным обязательствам
            (включая стандартные договорные условия ЕС).
          </p>

          <h2>9. Cookie</h2>
          <p>
            Сайт использует только технические cookie: сессия входа (защищённые httpOnly-cookie), признак входа для
            интерфейса, выбранный язык и временная cookie на время подключения Gmail. Рекламных и аналитических cookie
            нет, поэтому баннер согласия не показывается.
          </p>

          <h2>10. Удаление данных и отзыв доступа</h2>
          <ul>
            <li>
              <b>Отключить Gmail</b> — кнопкой «Отключить» в личном кабинете. Токен сразу отзывается у Google и
              удаляется у нас.
            </li>
            <li>
              <b>Отозвать доступ на стороне Google</b> — на странице {permissionsLink}: выберите Airletter и удалите
              доступ.
            </li>
            <li>
              <b>Удалить аккаунт и все данные</b> — напишите на {mail} с адреса аккаунта. Мы удалим аккаунт, кампании,
              вложения, журнал отправки и токены в течение 30 дней и подтвердим удаление. Сведения о платежах хранятся
              столько, сколько требует закон.
            </li>
            <li>Данные в браузере удаляются вместе с расширением или при выходе из аккаунта в нём.</li>
          </ul>

          <h2>11. Ваши права</h2>
          <p>
            Вы можете запросить доступ к своим данным и их копию в машиночитаемом виде, исправление, удаление,
            ограничение обработки, возразить против обработки и отозвать согласие. Запросы — на {mail}, ответ в течение
            30 дней. Вы также вправе обратиться с жалобой в Роскомнадзор или в надзорный орган по защите данных в
            стране вашего проживания.
          </p>

          <h2>12. Возраст</h2>
          <p>Сервис не предназначен для лиц младше 16 лет. Мы сознательно не собираем их данные.</p>

          <h2>13. Изменения политики</h2>
          <p>
            Дата последней редакции указана вверху страницы. О существенных изменениях мы заранее сообщим по email.
            Если изменения касаются использования данных Google, мы запросим новое согласие.
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
          This policy explains what data Airletter — the website, the dashboard and the Chrome extension (together, the
          “service”) — processes, why, where it is stored, who it is shared with and how to delete it. A separate section
          covers data received from Google.
        </p>

        <h2>1. Who we are</h2>
        <p>
          Data controller: {operator("en")}. Address: {address}. For any question about your data: {mail}.
        </p>

        <h2>2. Data we receive</h2>
        <h3>Your Airletter account</h3>
        <ul>
          <li>The email address and name you enter when you sign up.</li>
          <li>Your password, stored only as an irreversible bcrypt hash; we never store or see the password itself.</li>
        </ul>

        <h3>Google data — only when you connect Gmail</h3>
        <p>Airletter requests the following scopes and receives only this through them:</p>
        <ul>
          <li>
            <b>openid, userinfo.email, userinfo.profile</b> — your Google account email address, name and profile
            picture. Used to show which address your emails are sent from and to fill in the “From” field.
          </li>
          <li>
            <b>gmail.send</b> — permission to send email on your behalf. Airletter only sends the emails you have written
            and launched yourself. We <b>do not read</b> your inbox or sent mail, do not receive your message list,
            contacts or mailbox metadata, and do not modify or delete anything — this scope does not grant such access.
          </li>
          <li>
            <b>spreadsheets.readonly</b> — reading the Google Sheet you point to when importing recipients. We read only
            the range you specify, at the moment of import, and keep only the email addresses from its first column. The
            rest of the spreadsheet is not stored. We do not open any of your other files.
          </li>
          <li>
            <b>Google OAuth tokens</b> that allow the actions above. Stored encrypted.
          </li>
        </ul>

        <h3>Campaigns</h3>
        <ul>
          <li>Subject, body (HTML or plain text), attachments and inline images, recipient addresses, schedule.</li>
          <li>
            Delivery log: status per recipient, time, the Gmail ID of the sent message, and the error text if a message
            failed.
          </li>
        </ul>

        <h3>Payments</h3>
        <ul>
          <li>
            Plan, amount, currency, payment status and ID. We never receive or store card details — YooKassa and Stripe
            process them on their own pages.
          </li>
        </ul>

        <h3>Technical data</h3>
        <ul>
          <li>Server logs: IP address, request time and path, response code — for security and troubleshooting.</li>
          <li>
            The extension keeps your Airletter sign-in tokens and imported recipient lists in Chrome extension storage on
            your device.
          </li>
        </ul>

        <h2>3. How we use data</h2>
        <p>Only to provide the features you see in the service:</p>
        <ul>
          <li>signing you in and protecting your account;</li>
          <li>sending your campaigns through your Gmail within daily limits;</li>
          <li>importing recipients from the spreadsheet you choose;</li>
          <li>showing campaign status and statistics in the dashboard and extension;</li>
          <li>processing payments, tracking your plan and meeting tax obligations;</li>
          <li>answering your support requests.</li>
        </ul>
        <p>
          We do not use data for advertising, do not profile users and do not sell data. We never send our own messages
          to your recipients.
        </p>

        <h2>4. Google user data and Limited Use</h2>
        {limitedUse}
        <p>In particular:</p>
        <ul>
          <li>Google user data is used only to provide the Airletter features described above and visible to you;</li>
          <li>Google user data is never used to serve ads, including personalized ads and retargeting;</li>
          <li>Google user data is never sold and never shared with data brokers or advertising platforms;</li>
          <li>
            Google user data is transferred to third parties only as needed to provide the service (see section 7), to
            comply with the law, or as part of a merger, acquisition or sale of the service — and only with your prior
            consent;
          </li>
          <li>
            no human reads your Google user data unless you have given explicit consent for a specific case (for example,
            a support request), it is needed to investigate abuse or for security, it is required by law, or the data is
            aggregated and anonymized for internal operations;
          </li>
          <li>
            Airletter does not use data obtained through Google Workspace APIs to develop, improve or train generalized
            artificial intelligence or machine learning models ({workspacePolicy}).
          </li>
        </ul>

        <h2>5. Legal bases (GDPR)</h2>
        <ul>
          <li>performance of a contract (our Terms of Service): your account, sending campaigns, payments;</li>
          <li>consent: connecting Gmail and granting Google permissions — you can withdraw it at any time;</li>
          <li>legitimate interests: security of the service and abuse prevention (server logs);</li>
          <li>legal obligations: keeping payment and tax records.</li>
        </ul>

        <h2>6. Where and how data is stored</h2>
        <ul>
          <li>Backend server and database: {hosting}. The website is hosted on Vercel.</li>
          <li>All connections use HTTPS (TLS) only.</li>
          <li>
            Google OAuth tokens are encrypted at rest (AES-256-GCM), passwords are stored as bcrypt hashes, and session
            tokens live in cookies that page scripts cannot read.
          </li>
          <li>Only the operator has access to the servers and the database.</li>
        </ul>
        <h3>Retention</h3>
        <ul>
          <li>account, campaigns and delivery log — while your account exists, or until you ask us to delete them;</li>
          <li>
            Google tokens — until you disconnect Gmail in the dashboard or revoke access in your Google account; on
            disconnect the token is revoked with Google and deleted immediately;
          </li>
          <li>payment records — for the period required by tax law;</li>
          <li>server logs — for the limited time needed for security and troubleshooting.</li>
        </ul>

        <h2>7. Who we share data with</h2>
        <p>Only with providers the service cannot work without, and only to the extent their task requires:</p>
        <ul>
          <li>backend and database hosting — {hosting};</li>
          <li>Vercel Inc. (USA) — website hosting;</li>
          <li>Google LLC (USA) — sending email via the Gmail API and reading the spreadsheets you choose, on your instruction;</li>
          <li>YooMoney LLC (YooKassa, Russia) — payments in rubles;</li>
          <li>Stripe, Inc. (USA) and Stripe Payments Europe, Ltd. (Ireland) — payments in US dollars.</li>
        </ul>
        <p>
          Google user data is never shared with payment providers or other third parties. The service uses no analytics
          or advertising services.
        </p>

        <h2>8. International transfers</h2>
        <p>
          Some providers (Google, Vercel, Stripe) are located outside the EU and Russia. Data is transferred only to
          provide the service, and these providers protect it under their own safeguards and contractual commitments,
          including the EU Standard Contractual Clauses.
        </p>

        <h2>9. Cookies</h2>
        <p>
          The website uses only essential cookies: the sign-in session (secure httpOnly cookies), a signed-in marker for
          the interface, your language, and a short-lived cookie while you connect Gmail. There are no advertising or
          analytics cookies, so no consent banner is shown.
        </p>

        <h2>10. Deleting data and revoking access</h2>
        <ul>
          <li>
            <b>Disconnect Gmail</b> with the “Disconnect” button in the dashboard. The token is revoked with Google and
            deleted on our side immediately.
          </li>
          <li>
            <b>Revoke access on Google’s side</b> at {permissionsLink}: select Airletter and remove access.
          </li>
          <li>
            <b>Delete your account and all data</b> by emailing {mail} from your account address. We delete the account,
            campaigns, attachments, delivery log and tokens within 30 days and confirm the deletion. Payment records are
            kept as long as the law requires.
          </li>
          <li>Data in your browser is removed with the extension or when you sign out in it.</li>
        </ul>

        <h2>11. Your rights</h2>
        <p>
          You can request access to your data and a copy in a machine-readable format, rectification, erasure,
          restriction of processing, object to processing and withdraw consent. Send requests to {mail}; we respond
          within 30 days. You also have the right to lodge a complaint with the data protection authority in your country
          of residence.
        </p>

        <h2>12. Age</h2>
        <p>The service is not intended for anyone under 16. We do not knowingly collect their data.</p>

        <h2>13. Changes to this policy</h2>
        <p>
          The date of the latest version is shown at the top of this page. We will notify you by email in advance of
          material changes. If a change affects how we use Google user data, we will ask for your consent again.
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
            Эти условия — публичная оферта на предоставление доступа к сервису Airletter. Регистрируясь или оплачивая
            тариф, вы принимаете их полностью. Исполнитель: {operator("ru")}.
          </p>

          <h2>1. Сервис</h2>
          <p>
            Airletter — расширение для Chrome и личный кабинет на сайте. Вы пишете письмо в Gmail, а Airletter
            отправляет его каждому получателю отдельно — от вашего имени, через ваш аккаунт Gmail (Gmail API), с
            паузами и в пределах дневных лимитов. Вы сами выбираете получателей, текст и время отправки.
          </p>
          <p>
            Airletter — независимый сервис, он не связан с Google LLC и не одобрен ею. Gmail и Google Таблицы —
            товарные знаки Google LLC.
          </p>

          <h2>2. Аккаунт</h2>
          <ul>
            <li>Для работы нужны аккаунт Airletter, аккаунт Gmail или Google Workspace и браузер Chrome.</li>
            <li>Вы отвечаете за сохранность пароля и за действия, совершённые в вашем аккаунте.</li>
            <li>Сервисом могут пользоваться лица старше 16 лет; оплачивать тарифы — дееспособные лица.</li>
          </ul>

          <h2>3. Допустимое использование</h2>
          <p>Airletter предназначен для персональных писем людям, которые ждут их от вас. Запрещено:</p>
          <ul>
            <li>спам: письма тем, кто не давал согласия и с кем у вас нет деловых отношений, купленные и собранные базы;</li>
            <li>фишинг, мошенничество, выдача себя за другое лицо, вредоносные ссылки и вложения;</li>
            <li>незаконный контент, нарушение чужих прав, угрозы и травля;</li>
            <li>попытки обойти лимиты Gmail, ограничения сервиса или использовать чужие аккаунты.</li>
          </ul>
          <p>Вы обязуетесь:</p>
          <ul>
            <li>
              соблюдать законы о рекламе, рассылках и персональных данных, применимые к вам и вашим получателям: в
              том числе 38-ФЗ «О рекламе», 152-ФЗ «О персональных данных», GDPR и ePrivacy (ЕС), немецкий UWG,
              CAN-SPAM (США);
            </li>
            <li>указывать в рекламных письмах, кто вы, и выполнять просьбы получателей больше им не писать;</li>
            <li>соблюдать {gmailPolicies} и лимиты отправки Gmail.</li>
          </ul>
          <p>
            При нарушении этих правил или жалобах получателей мы вправе приостановить отправку или заблокировать
            аккаунт, а в явных случаях — без предупреждения. За неиспользованный период при блокировке за нарушение
            деньги не возвращаются.
          </p>

          <h2>4. Ваш контент и получатели</h2>
          <p>
            Вы несёте ответственность за содержание писем, вложения и базу получателей, в том числе за наличие законных
            оснований писать каждому получателю. Мы не проверяем и не редактируем ваши письма. Вы предоставляете нам
            право обрабатывать этот контент только для отправки ваших кампаний.
          </p>

          <h2>5. Тарифы и оплата</h2>
          <ul>
            <li>
              Пробный период — 10 дней, до 30 писем в день, бесплатно. Импорт из Google Таблиц на пробном периоде
              недоступен, а в письма добавляется строка «Разослано с помощью Airletter».
            </li>
            <li>
              Цены платных тарифов указаны на странице «Тарифы». Оплата — заранее за месяц или за год через ЮKassa
              (рубли) или Stripe (доллары США). После оплаты исполнитель направляет чек.
            </li>
            <li>
              <b>Автопродления нет.</b> Мы не списываем деньги без вашего действия; по окончании периода отправка
              приостанавливается до новой оплаты.
            </li>
            <li>
              Тот же тариф можно продлить за 7 дней до окончания. Более высокий тариф начинает действовать сразу после
              оплаты и заменяет текущий.
            </li>
            <li>
              Фактический объём отправки ограничен лимитами Gmail: около 500 писем в день для обычного аккаунта и около
              2000 для Google Workspace.
            </li>
          </ul>

          <h2>6. Отмена и возврат</h2>
          <ul>
            <li>Вы можете перестать пользоваться сервисом в любой момент.</li>
            <li>
              Если в оплаченном периоде вы не отправили ни одного письма, в течение 14 дней после оплаты можно запросить
              полный возврат на {mail}.
            </li>
            <li>
              Потребители из ЕС вправе отказаться от договора в течение 14 дней без объяснения причин. Если вы начали
              отправку в этот срок, возвращается сумма за вычетом стоимости уже оказанных услуг пропорционально
              использованному времени.
            </li>
            <li>Возврат выполняется тем же способом, которым была оплата, обычно в течение 10 рабочих дней.</li>
          </ul>

          <h2>7. Гарантии и ответственность</h2>
          <p>
            Сервис предоставляется «как есть». Мы стараемся, чтобы он работал без перерывов, но не гарантируем
            доставку в папку «Входящие», не отвечаем за решения спам-фильтров, за ограничения или блокировку вашего
            аккаунта Google и за изменения в Gmail API. Наша ответственность ограничена суммой, которую вы заплатили за
            последние 12 месяцев. Ничто в этих условиях не ограничивает права потребителей, которые нельзя ограничить по
            закону.
          </p>

          <h2>8. Прекращение</h2>
          <p>
            Вы можете удалить аккаунт, написав на {mail}. Мы можем прекратить доступ при нарушении условий. После
            прекращения данные удаляются, как описано в{" "}
            <Link href="/ru/privacy">Политике конфиденциальности</Link>.
          </p>

          <h2>9. Применимое право</h2>
          <p>
            К условиям применяется право Российской Федерации. Споры решаются переговорами, а при недостижении
            согласия — в суде по месту нахождения исполнителя, если закон не предусматривает иного. Права потребителя,
            предоставленные законом страны его проживания, сохраняются.
          </p>

          <h2>10. Изменения</h2>
          <p>
            Мы можем обновлять условия. О существенных изменениях сообщим по email не позднее чем за 14 дней.
            Продолжая пользоваться сервисом, вы принимаете новую редакцию.
          </p>

          <h2>11. Контакты</h2>
          <p>
            {mail}. Исполнитель: {operator("ru")}, {address}.
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
        <p>
          These terms govern your use of Airletter. By signing up or paying for a plan you accept them in full. Service
          provider: {operator("en")}.
        </p>

        <h2>1. The service</h2>
        <p>
          Airletter is a Chrome extension and a web dashboard. You write an email in Gmail, and Airletter sends it to each
          recipient individually — on your behalf, through your own Gmail account (Gmail API), paced and within daily
          limits. You choose the recipients, the content and when it is sent.
        </p>
        <p>
          Airletter is an independent service. It is not affiliated with, endorsed or sponsored by Google LLC. Gmail and
          Google Sheets are trademarks of Google LLC.
        </p>

        <h2>2. Your account</h2>
        <ul>
          <li>You need an Airletter account, a Gmail or Google Workspace account and the Chrome browser.</li>
          <li>You are responsible for keeping your password safe and for activity in your account.</li>
          <li>You must be at least 16 to use the service, and of legal age to pay for a plan.</li>
        </ul>

        <h2>3. Acceptable use</h2>
        <p>Airletter is meant for personal emails to people who expect to hear from you. You must not:</p>
        <ul>
          <li>send spam: email people who have not agreed to it and have no business relationship with you, or use bought or scraped lists;</li>
          <li>send phishing, scams or malware, or impersonate anyone;</li>
          <li>send unlawful content, infringe others’ rights, threaten or harass anyone;</li>
          <li>try to circumvent Gmail limits or service restrictions, or use accounts that are not yours.</li>
        </ul>
        <p>You agree to:</p>
        <ul>
          <li>
            comply with the marketing, anti-spam and data protection laws that apply to you and your recipients,
            including CAN-SPAM (USA), the GDPR and ePrivacy rules (EU), the German UWG, and Russian Federal Laws 38-FZ and
            152-FZ;
          </li>
          <li>identify yourself in marketing emails and honor recipients’ requests to stop emailing them;</li>
          <li>follow the {gmailPolicies} and Gmail sending limits.</li>
        </ul>
        <p>
          If you break these rules or recipients complain, we may pause sending or suspend your account, without notice
          in clear cases. No refund is due for the unused period of an account suspended for a violation.
        </p>

        <h2>4. Your content and recipients</h2>
        <p>
          You are responsible for the content of your emails, attachments and recipient list, including having a lawful
          basis to email each recipient. We do not review or edit your emails. You grant us the right to process this
          content solely to send your campaigns.
        </p>

        <h2>5. Plans and payment</h2>
        <ul>
          <li>
            The trial lasts 10 days with up to 30 emails a day, free of charge. Google Sheets import is not available on
            the trial, and emails carry a “Sent with Airletter” line.
          </li>
          <li>
            Paid plan prices are listed on the Pricing page. Plans are prepaid for a month or a year via YooKassa (rubles)
            or Stripe (US dollars).
          </li>
          <li>
            <b>Plans do not renew automatically.</b> We never charge you without your action; when the period ends,
            sending pauses until you pay again.
          </li>
          <li>
            You can renew the same plan within 7 days of its end. A higher plan starts right after payment and replaces
            the current one.
          </li>
          <li>
            Actual sending volume is capped by Gmail limits: about 500 emails a day for a regular account and about 2,000
            for Google Workspace.
          </li>
        </ul>

        <h2>6. Cancellation and refunds</h2>
        <ul>
          <li>You can stop using the service at any time.</li>
          <li>
            If you have not sent any email in the paid period, you can request a full refund within 14 days of payment at{" "}
            {mail}.
          </li>
          <li>
            Consumers in the EU have the right to withdraw from the contract within 14 days without giving a reason. If
            you asked us to start the service during that period (by sending emails), you receive a refund minus a
            proportionate amount for the service already provided.
          </li>
          <li>Refunds go back to the original payment method, usually within 10 business days.</li>
        </ul>

        <h2>7. Disclaimer and liability</h2>
        <p>
          The service is provided “as is”. We work to keep it running without interruption, but we do not guarantee inbox
          placement and are not responsible for spam filter decisions, restrictions or suspensions Google places on your
          account, or changes to the Gmail API. Our liability is limited to the amount you paid us in the last 12
          months. Nothing in these terms limits consumer rights that cannot be limited by law.
        </p>

        <h2>8. Termination</h2>
        <p>
          You can delete your account by emailing {mail}. We may end your access if you violate these terms. After
          termination your data is deleted as described in the <Link href="/en/privacy">Privacy Policy</Link>.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These terms are governed by the laws of the Russian Federation. Disputes are settled by negotiation first and,
          failing that, in the courts at the provider’s location unless the law provides otherwise. Mandatory consumer
          protections of your country of residence remain unaffected.
        </p>

        <h2>10. Changes</h2>
        <p>
          We may update these terms and will notify you by email at least 14 days before material changes take effect.
          Continuing to use the service means you accept the new version.
        </p>

        <h2>11. Contact</h2>
        <p>
          {mail}. Service provider: {operator("en")}, {address}.
        </p>
      </>
    ),
  }
}
