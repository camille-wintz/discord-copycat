import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { TextInput } from "../components/TextInput";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const [text, setText] = useState(``);
  console.log(text);

  return (
    <div className={styles.container}>
      <div className={styles.chat}></div>
      <div className={styles.textbox}>
        <TextInput value={text} onChange={(e) => setText(e)} />
      </div>
    </div>
  );
};

export default Home;
