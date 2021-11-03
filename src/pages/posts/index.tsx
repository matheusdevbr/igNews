import Head from 'next/head';
import React from 'react';
import styles from './styles.module.scss';

export default function Posts() {
  return(
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>03 de novembro de 2021</time>
            <strong>Introdução a ciclo de vida de software</strong>
            <p>De acordo com Gordon e Gordon (2006), o ciclo de vida do desenvolvimento de sistemas (Systems Development Life Cycle – SDLC), conhecido também como ciclo de vida do software, refere-se aos estágios de concepção, projeto, criação e implementação de um Sistema de Informação (SI). Um desdobramento possível para SDLC </p>
          </a>
          <a href="#">
            <time>03 de novembro de 2021</time>
            <strong>Introdução a ciclo de vida de software</strong>
            <p>De acordo com Gordon e Gordon (2006), o ciclo de vida do desenvolvimento de sistemas (Systems Development Life Cycle – SDLC), conhecido também como ciclo de vida do software, refere-se aos estágios de concepção, projeto, criação e implementação de um Sistema de Informação (SI). Um desdobramento possível para SDLC </p>
          </a>
          <a href="#">
            <time>03 de novembro de 2021</time>
            <strong>Introdução a ciclo de vida de software</strong>
            <p>De acordo com Gordon e Gordon (2006), o ciclo de vida do desenvolvimento de sistemas (Systems Development Life Cycle – SDLC), conhecido também como ciclo de vida do software, refere-se aos estágios de concepção, projeto, criação e implementação de um Sistema de Informação (SI). Um desdobramento possível para SDLC </p>
          </a>
        </div>
      </main>
    </>
  );
}