/* This editor exports public content only. It requires no account or credentials. */
const form = document.querySelector('#editor');
const status = document.querySelector('#status');
let content;
let dirty = false;
const labels = {profile:'Profile & page text',experience:'Education & experience',projects:'Projects',certificates:'Certificates',firstName:'First name',yearsExperience:'Years of experience',src:'Image path',alt:'Image description (for accessibility)',id:'Project ID (unique, e.g. financial-analysis)',linkedin:'LinkedIn URL',github:'GitHub URL',tests:'Tests & validation',sections:'Explanations / methodology',metrics:'KPIs & metrics',findings:'Key findings',screenshots:'Screenshots',portrait:'Portrait image path'};
const templates = {
  experience:{date:'',title:'',place:'',description:''},
  projects:{id:'new-project',title:'New project',category:'POWER BI',summary:'',screenshots:[],metrics:[],findings:[],sections:[],tests:[]},
  certificates:{year:'',title:'',issuer:'',image:''},
  screenshots:{src:'assets/',alt:'',caption:''},metrics:{label:'',value:'',detail:''},findings:'',sections:{title:'',text:''},tests:{title:'',text:''}
};
function label(key) { return labels[key] || key.replace(/([A-Z])/g,' $1').replace(/^./, letter => letter.toUpperCase()); }
function get(path) { return path.reduce((object,key) => object[key], content); }
function set(path,value) { const parent=get(path.slice(0,-1)); parent[path.at(-1)]=value; dirty=true; status.textContent='Changes ready. Download the file to keep them.'; }
function makeButton(text,className,onClick) { const button=document.createElement('button');button.type='button';button.textContent=text;button.className=className;button.addEventListener('click',onClick);return button; }
function fields(value,path) {
  const container=document.createElement('div'); container.className='fields';
  Object.entries(value).forEach(([key,entry]) => container.append(field(entry,[...path,key],key)));
  return container;
}
function field(value,path,key) {
  if (Array.isArray(value)) {
    const group=document.createElement('div');
    const heading=document.createElement('h3');heading.className='list-heading';heading.textContent=label(key);group.append(heading);
    value.forEach((entry,index) => {
      const box=document.createElement('fieldset'); const legend=document.createElement('legend');legend.textContent=`${label(key)} · ${index+1}`;box.append(legend);
      box.append(typeof entry==='object' ? fields(entry,[...path,index]) : field(entry,[...path,index], 'text'));
      box.append(makeButton('Remove item','remove',()=>{if(!confirm('Remove this item from your draft?'))return;get(path).splice(index,1);dirty=true;render();}));group.append(box);
    });
    group.append(makeButton(`+ Add ${label(key).toLowerCase()}`,'add',()=>{get(path).push(structuredClone(templates[key] ?? ''));dirty=true;render();}));
    return group;
  }
  if (value && typeof value==='object') return fields(value,path);
  const wrapper=document.createElement('label');wrapper.className='field';const name=document.createElement('span');name.textContent=label(key);wrapper.append(name);
  const input=document.createElement(['intro','about','summary','description','text','detail'].includes(key)?'textarea':'input');
  input.value=value ?? '';input.addEventListener('input',()=>set(path,input.value));wrapper.append(input);
  return wrapper;
}
function render() {
  const openSections=new Set([...form.querySelectorAll('details[open]')].map(item=>item.dataset.section));
  const fragment=document.createDocumentFragment();
  Object.entries(content).forEach(([key,value]) => {
    const section=document.createElement('details');section.dataset.section=key;section.open=openSections.has(key)||key==='profile';
    const title=document.createElement('summary');title.textContent=label(key);section.append(title);
    if(Array.isArray(value)){const wrap=document.createElement('div');wrap.className='fields';wrap.append(field(value,[key],key));section.append(wrap);}else section.append(fields(value,[key]));
    fragment.append(section);
  });
  form.replaceChildren(fragment);
  status.textContent=dirty?'Changes ready. Download the file to keep them.':'Ready to edit.';
}
function validate(data) {
  if(!data.profile || !Array.isArray(data.projects) || !Array.isArray(data.experience) || !Array.isArray(data.certificates))throw new Error('This file is missing profile, projects, experience or certificates.');
  if(!data.profile.name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email))throw new Error('Enter a name and a valid email address.');
  const ids=new Set();
  const imagePath=value=> /^(assets\/[^\s]+|https:\/\/[^\s]+)$/.test(value || '');
  data.projects.forEach(project=>{
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)||ids.has(project.id))throw new Error('Every project needs a unique ID using lowercase letters, numbers and hyphens.');
    ids.add(project.id);
    if(!project.title?.trim())throw new Error('Every project needs a title.');
    if(!Array.isArray(project.screenshots)||!project.screenshots.length||project.screenshots.some(image=>!imagePath(image.src)))throw new Error(`${project.title}: add at least one screenshot with a path such as assets/dashboard.webp.`);
    ['metrics','findings','sections','tests'].forEach(key=>{if(!Array.isArray(project[key]))throw new Error(`${project.title}: ${key} must be a list.`);});
  });
  if(!imagePath(data.profile.portrait))throw new Error('Enter a valid portrait image path.');
  data.certificates.forEach(item=>{if(!imagePath(item.image))throw new Error('Every certificate needs a valid image path.');});
}
document.querySelector('#export').addEventListener('click',()=>{
  if(!content)return;
  try{validate(content);}catch(error){status.textContent=error.message;return;}
  const url=URL.createObjectURL(new Blob(['/* Public portfolio content. Update this file using the content editor. */\nwindow.PORTFOLIO_CONTENT = '+JSON.stringify(content,null,2)+';\n'],{type:'text/javascript'}));
  const link=document.createElement('a');link.href=url;link.download='content.js';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;status.textContent='Downloaded. Replace content.js in your GitHub repository to publish these edits.';
});
document.querySelector('#import').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{const data=parseContentFile(await file.text());validate(data);content=data;dirty=false;render();}catch(error){status.textContent='Could not import: '+error.message;}
  event.target.value='';
});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
// Accept the current content.js format and older content.json exports without executing code.
function parseContentFile(source) {
  const text = source.replace(/^\uFEFF/, '').trim();
  if (text.startsWith('{')) return JSON.parse(text);
  const script = text.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  const match = script.match(/^window\.PORTFOLIO_CONTENT\s*=\s*([\s\S]*?)\s*;\s*$/);
  if (!match) throw new Error('Choose a portfolio content.js or an older content.json export.');
  return JSON.parse(match[1]);
}
try {
  validate(window.PORTFOLIO_CONTENT);
  content = structuredClone(window.PORTFOLIO_CONTENT);
  render();
} catch {
  status.textContent = 'The content file did not load. Import content.js or an older content.json to start.';
}
