import React from 'react';

export default function About() {
  return (
    <div className='about'>
      <div className='about-container'>
        <div className='about-container'>
            <section className='about-intro'>
                <h1>TerraSafe</h1>
                <p>Une application web pour suivre les tremblements de terre, collecter des fonds pour les victimes et recevoir des alertes.</p>
            </section>
        </div>
        <div className='about-image'>
            <img src='/images/image1.jpg' alt='seisme'></img>
        </div>
      </div>
    </div>
  );
}