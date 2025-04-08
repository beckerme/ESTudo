"use client";

import React, { useState, useEffect } from 'react';

export default function TempoRelativo({ data }) {
    const [tempoDecorrido, setTempoDecorrido] = useState(calculaTempoRelativo(data));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTempoDecorrido(calculaTempoRelativo(data));
      }, 60000); // Atualiza a cada minuto
  
      return () => clearInterval(interval);
    }, [data]);
  
    function calculaTempoRelativo(dataString) {
      const agora = new Date();
      const dataComentario = new Date(dataString);
      const diferencaSegundos = Math.floor((agora - dataComentario) / 1000);
      const diferencaMinutos = Math.floor(diferencaSegundos / 60);
      const diferencaHoras = Math.floor(diferencaSegundos / 3600);
      const diferencaDias = Math.floor(diferencaSegundos / 86400);
      const diferencaMeses = Math.floor(diferencaDias / 30);
      const diferencaAnos = Math.floor(diferencaDias / 365);
      
      if (diferencaSegundos < 10) {
        return "Agora mesmo";
      } else if (diferencaSegundos < 60) {
        return `Há ${diferencaSegundos} segundo${diferencaSegundos !== 1 ? 's' : ''}`;
      } else if (diferencaMinutos < 60) {
        return `Há ${diferencaMinutos} minuto${diferencaMinutos !== 1 ? 's' : ''}`;
      } else if (diferencaHoras < 24) {
        return `Há ${diferencaHoras} hora${diferencaHoras !== 1 ? 's' : ''}`;
      } else if (diferencaDias < 30) {
        return `Há ${diferencaDias} dia${diferencaDias !== 1 ? 's' : ''}`;
      } else if (diferencaMeses < 12) {
        return `Há ${diferencaMeses} mês${diferencaMeses !== 1 ? 'es' : ''}`;
      } else {
        return `Há ${diferencaAnos} ano${diferencaAnos !== 1 ? 's' : ''}`;
      }
    }
  
    return <span>{tempoDecorrido}</span>;
  }