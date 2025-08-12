import styled from "styled-components";

export const SpinnerStyle = styled.div`
  .spinner {
    font-size: 18px;
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  .spinner.center {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .spinner .spinner-blade {
    position: absolute;
    left: 0.4629em;
    bottom: 0;
    width: 0.074em;
    height: 0.2777em;
    border-radius: 0.0555em;
    background-color: transparent;
    -webkit-transform-origin: center -0.2222em;
    -ms-transform-origin: center -0.2222em;
    transform-origin: center -0.2222em;
    animation: spinner-fade9234 1s infinite linear;
  }

  .spinner .spinner-blade:nth-child(1) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  .spinner .spinner-blade:nth-child(2) {
    -webkit-animation-delay: 0.083s;
    animation-delay: 0.083s;
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
  }

  .spinner .spinner-blade:nth-child(3) {
    -webkit-animation-delay: 0.166s;
    animation-delay: 0.166s;
    -webkit-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    transform: rotate(60deg);
  }

  .spinner .spinner-blade:nth-child(4) {
    -webkit-animation-delay: 0.249s;
    animation-delay: 0.249s;
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .spinner .spinner-blade:nth-child(5) {
    -webkit-animation-delay: 0.332s;
    animation-delay: 0.332s;
    -webkit-transform: rotate(120deg);
    -ms-transform: rotate(120deg);
    transform: rotate(120deg);
  }

  .spinner .spinner-blade:nth-child(6) {
    -webkit-animation-delay: 0.415s;
    animation-delay: 0.415s;
    -webkit-transform: rotate(150deg);
    -ms-transform: rotate(150deg);
    transform: rotate(150deg);
  }

  .spinner .spinner-blade:nth-child(7) {
    -webkit-animation-delay: 0.498s;
    animation-delay: 0.498s;
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .spinner .spinner-blade:nth-child(8) {
    -webkit-animation-delay: 0.581s;
    animation-delay: 0.581s;
    -webkit-transform: rotate(210deg);
    -ms-transform: rotate(210deg);
    transform: rotate(210deg);
  }

  .spinner .spinner-blade:nth-child(9) {
    -webkit-animation-delay: 0.664s;
    animation-delay: 0.664s;
    -webkit-transform: rotate(240deg);
    -ms-transform: rotate(240deg);
    transform: rotate(240deg);
  }

  .spinner .spinner-blade:nth-child(10) {
    -webkit-animation-delay: 0.747s;
    animation-delay: 0.747s;
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
  }

  .spinner .spinner-blade:nth-child(11) {
    -webkit-animation-delay: 0.83s;
    animation-delay: 0.83s;
    -webkit-transform: rotate(300deg);
    -ms-transform: rotate(300deg);
    transform: rotate(300deg);
  }

  .spinner .spinner-blade:nth-child(12) {
    -webkit-animation-delay: 0.913s;
    animation-delay: 0.913s;
    -webkit-transform: rotate(330deg);
    -ms-transform: rotate(330deg);
    transform: rotate(330deg);
  }

  @keyframes spinner-fade9234 {
    0% {
      background-color: #fff;
    }

    100% {
      background-color: transparent;
    }
  }
`;

export const StyledWrapper = styled.div`
  .cssbuttons-io-button {
    background: #a370f0;
    color: white;
    font-family: inherit;
    padding: 0.35em;
    padding-left: 1.2em;
    font-size: 17px;
    font-weight: 500;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em #714da6;
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.3em;
    cursor: pointer;
  }

  .cssbuttons-io-button .icon {
    background: white;
    margin-left: 1em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em #7b52b9;
    right: 0.3em;
    transition: all 0.3s;
  }

  .cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
  }

  .cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: #7b52b9;
  }

  .cssbuttons-io-button:hover .icon svg {
    transform: translateX(0.1em);
  }

  .cssbuttons-io-button:active .icon {
    transform: scale(0.95);
  }
`;
