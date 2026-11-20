import {readFileSync,writeFileSync} from 'fs';
import {chromium} from 'playwright-core';
const D='/data/hacknation/prezenter/docs/';
const md=readFileSync(D+'slajdy-szkic.md','utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`(.+?)`/g,'<code>$1</code>');
const parts=md.split(/^## /m).slice(1);
let html=`<html><head><meta charset=utf8><style>
@page{size:1280px 720px;margin:0}body{margin:0;font-family:Arial,sans-serif}
.s{width:1280px;height:720px;box-sizing:border-box;padding:48px 64px;page-break-after:always;position:relative;overflow:hidden}
.bar{position:absolute;top:0;left:0;right:0;background:#b45309;color:#fff;font-size:15px;text-align:center;padding:4px}
h1{font-size:44px;margin:14px 0 22px;color:#1e3a5f}ul{font-size:25px;line-height:1.35;margin:0;padding-left:28px}li{margin-bottom:10px}
.t{display:flex;gap:32px}.t ul{flex:1}.im{display:flex;flex-wrap:wrap;gap:10px;width:430px}.im img{max-width:430px;max-height:230px;border:1px solid #ccc;object-fit:contain}
.t.w{flex-direction:column}.t.w .im{width:100%}.t.w .im img{max-width:1150px;max-height:300px;width:auto}.t.w.big .im img{max-height:330px}.t.w ul{font-size:22px}.t.w li{margin-bottom:6px}table{border-collapse:collapse;margin-top:14px;font-size:22px}td{border:1px solid #999;padding:6px 14px}tr:first-child td{background:#e6edf5;font-weight:bold}.src{position:absolute;bottom:14px;left:64px;font-size:14px;color:#666}.l{flex:1}.im.many img{max-width:205px;max-height:150px}.t.w .im img[src*=wycinek-raport]{max-height:200px}.im.pp:has(img[src*=przed-po-lista]){width:660px}.im.pp img[src*=przed-po-lista]{max-width:660px;max-height:500px}.t.txt ul{font-size:32px;line-height:1.45}.t.txt li{margin-bottom:22px}code{background:#eee;padding:0 4px;font-size:.85em}.im.pp{width:600px}.im.pp img{max-width:600px;max-height:360px}.n{position:absolute;bottom:14px;right:24px;color:#888;font-size:14px}</style></head><body>`;
parts.forEach((p,i)=>{
 const lines=p.split('\n');const title=lines[0].replace(/^\d+\.\s*/,'');
 const imgs=[];const li=[];const rows=[];let src='';
 for(const l of lines.slice(1)){ if(l.startsWith('|')){ if(!/^\|[-| ]+\|?$/.test(l)) rows.push(l.split('|').slice(1,-1).map(x=>x.trim())); continue;} if(!l.startsWith('- '))continue;
  let t=l.slice(2);
  t=t.replace(/!\[[^\]]*\]\(([^)]+)\)/g,(m,u)=>{imgs.push(u);return ''}).trim();
  if(t.startsWith('Źródło:')){src=t;continue;} if(t)li.push(t);}
 html+=`<div class=s><div class=bar>dane sztuczne — demonstracja</div><h1>${inl(title)}</h1><div class="t${!imgs.length&&!rows.length?' txt':''}${imgs.some(u=>/wycinek/.test(u)||/przeoczenia/.test(u)||/wycinek-raport/.test(u))?" w":""}${imgs.some(u=>/przeoczenia/.test(u))?" big":""}"><div class=l><ul>${li.map(x=>'<li>'+inl(x)+'</li>').join('')}</ul>${rows.length?'<table>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+inl(c)+'</td>').join('')+'</tr>').join('')+'</table>':''}</div>${imgs.length?'<div class="im'+(imgs.length>2?' many':'')+(imgs.some(u=>/przed-po/.test(u))?' pp':'')+'">'+imgs.map(u=>`<img src="file://${D}${u}">`).join('')+'</div>':''}</div>${src?'<div class=src>'+inl(src)+'</div>':''}<div class=n>${i+1}/${parts.length}</div></div>`;
});
html+='</body></html>';
writeFileSync('/tmp/pdfb/s.html',html);
const exe=process.argv[2];
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox','--allow-file-access-from-files']});
const pg=await b.newPage();await pg.goto('file:///tmp/pdfb/s.html');await pg.waitForTimeout(800);
await pg.pdf({path:D+'slajdy.pdf',width:'1280px',height:'720px',printBackground:true});
await b.close();console.log(parts.length);
