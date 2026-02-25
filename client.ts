const base = 'http://localhost:3000';

await fetch(base + '/cursos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    slug: 'javascript',
    nome: 'JavaScript',
    descricao: 'Curso de JavaScript'
  })
});

await fetch(base + '/aulas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    slug: 'variáveis',
    nome: 'Variáveis',
    cursoSlug: 'javascript'
  })
});

const cursos = await fetch(base + '/cursos').then(res => res.json());
console.log(cursos);

const curso = await fetch(base + "/curso?slug=javascript").then((res) => res.json());
console.log(curso);

const aulas = await fetch(base + "/aulas?curso=javascript").then((r) => r.json());
console.log(aulas);

const aula = await fetch(base + "/aula?curso=javascript&slug=variáveis").then((r) => r.json());
console.log(aula);

export { };


