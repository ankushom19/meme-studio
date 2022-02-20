import Button from '@components/Button/Button'
import styled from 'styled-components'

export default {
  Aside: styled.aside`
    height: calc(100vh - 5rem);
    background-color: #444444;
    z-index: 2;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.header`
    width: 100%;
    display: flex;
  `,
  Button: styled(Button)`
    flex: 1;
    border-radius: 0;
    font-size: 1.5rem;
    background-color: ${(props) => {
      return props.$isActive ? 'rgb(71, 121, 201)' : 'rgb(48, 91, 161);'
    }};
  `
}
