# Mania de Batata — Sistema de Pedidos Online

Site de pedidos online desenvolvido pra uma cliente da Vergueiro Tech que vende batatas recheadas e pratos rápidos. O desafio era simples: ela precisava receber pedidos de forma organizada sem pagar mensalidade de iFood ou precisar de uma maquininha de cartão pra delivery.

## Como funciona

O cliente acessa o site, monta o pedido adicionando itens na sacola e, ao finalizar, três coisas acontecem automaticamente:

1. **WhatsApp** — o pedido completo vai direto pro WhatsApp da loja com itens, quantidades e endereço de entrega já formatados
2. **PIX** — o cliente vê a chave PIX pra pagar na hora, sem precisar de maquininha
3. **Cartão** — quem prefere paga na entrega; o site informa isso automaticamente na mensagem pro WhatsApp

Sem intermediários, sem taxa por pedido, sem complicação.

## O que foi interessante de construir

A integração com WhatsApp via link `wa.me` com o pedido pré-formatado foi a parte mais criativa. Tive que pensar em como montar uma mensagem clara e legível automaticamente, independente do que o cliente escolhesse.

## Stack
HTML · CSS · JavaScript

## Cliente
Mania de Batata — Vergueiro Tech
