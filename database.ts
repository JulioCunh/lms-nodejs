import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./lsm.sqlite');

db.exec(`
    PRAGMA foreign_keys = 1;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    PRAGMA cache_size = 2000;
    PRAGMA busy_timeout = 5000;
    PRAGMA temp_store = MEMORY;

    CREATE TABLE IF NOT EXISTS "cursos" (
      "id" INTEGER PRIMARY KEY,
      "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
      "nome" TEXT NOT NULL,
      "descricao" TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS "aulas" (
      "id" INTEGER PRIMARY KEY,
      "curso_id" INTEGER NOT NULL,
      "slug" TEXT NOT NULL COLLATE NOCASE,
      "nome" TEXT NOT NULL,
      FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
      UNIQUE("curso_id", "slug")
    ) STRICT;
`);

export function criarCurso({ slug, nome, descricao }: { slug: string; nome: string; descricao: string }) {
  try {
    return db.prepare(
      `
    INSERT OR IGNORE INTO "cursos"
      ("slug", "nome", "descricao")
    VALUES
      (?,?,?)
  `
    ).run(slug, nome, descricao);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function criarAula({ cursoSlug, nome, slug }: { cursoSlug: string; nome: string; slug: string }) {
  try {
    return db
      .prepare(
        `
    INSERT OR IGNORE INTO "aulas"
      ("curso_id", "slug", "nome")
    VALUES
      ((SELECT "id" FROM "cursos" WHERE "slug" = ?),?,?)
  `
      )
      .run(cursoSlug, slug, nome);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarCursos() {
  try {
    return db
      .prepare(
        `
      SELECT * FROM "cursos"
    `
      )
      .all();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarCurso(slug: string) {
  try {
    return db
      .prepare(
        `
      SELECT * FROM "cursos" WHERE "slug" = ?
    `
      )
      .get(slug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarAulas(slug: string) {
  try {
    return db
      .prepare(
        `
      SELECT * FROM
        "aulas"
      WHERE "curso_id" = (SELECT "id" FROM "cursos" WHERE "slug" = ?)
    `
      )
      .all(slug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarAula(curso: string, slug: string) {
  try {
    return db
      .prepare(
        `
      SELECT * FROM
        "aulas"
      WHERE "curso_id" = (SELECT "id" FROM "cursos" WHERE "slug" = ?)
      AND "slug" = ?
    `
      )
      .get(curso, slug);
  } catch (error) {
    console.log(error);
    return null;
  }
}