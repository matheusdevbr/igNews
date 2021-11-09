import Link from 'next/link'
import React from 'react';
import { ActiveLink } from '../ActiveLink';

import { SingInButton } from '../SingInButton';
import styles from './styles.module.scss';

export function Header() {
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink activeClassName={styles.active}  href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink  activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SingInButton />
            </div>
        </header>
    )
}