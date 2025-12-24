import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import CodeViewer from '@site/src/components/CodeViewer';
import styled from 'styled-components';

const sampleCode = `如何解决鸡兔同笼？
    输入总头数、总脚数

    令鸡 = 0；令兔 = 0
    每当鸡 <= 总头数：
        兔 = 总头数 - 鸡        
        如果{鸡 * 2} + {兔 * 4} == 总脚数：
            输出[鸡，兔]
        鸡 = 鸡 + 1

    注：如果上面的循环结束了都还没有输出结果的话，那就只能抛出异常了
    抛出异常：“此题无解”！

令结果 = (解决鸡兔同笼：24、56)
输出“鸡数为{#}，兔数为{#}” % 结果`;

const HeaderContainer = styled.div`
  text-align: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.div`
  margin-top: 1rem;
  font-size: 4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0;
`;

const Subtitle = styled.h3`
  font-size: 1.6rem;
  color: #666;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0 1rem;
  }
`;


const ButtonBase = styled.a`
  display: inline-block;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1.1rem;
  margin: 1rem 0.5rem 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 2rem;
  }
`;

const PurpleButton = styled(ButtonBase)`
  background-color: #6b46c1;
  border: 1px solid #6b46c1;
  
  &:hover {
    background-color: #553c9a;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Version = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const SectionTitle = styled.h3`
  font-size: 2.2rem;
  margin: 2rem auto;
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
`;


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <HeaderContainer>
      <Title>
        <img src="img/TITLE.svg" alt="芯语言" style={{  height: '135px' }} />
      </Title>
      <Subtitle>千里之行 &nbsp;&nbsp;始于足下</Subtitle>

      <ButtonContainer>
        <PurpleButton href="#download">
          下载：Win/Linux/Mac <Version>(rev08)</Version>
        </PurpleButton>
      </ButtonContainer>

    </HeaderContainer>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <CodeViewer code={sampleCode} />
      <main>
        <SectionTitle>面向大众的编程语言</SectionTitle>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
