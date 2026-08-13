import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Row,
  Spin,
  Statistic,
  Typography,
} from "antd";

import {
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

const { Title, Paragraph, Text } = Typography;

function DashboardPage() {
  const navigate = useNavigate();

  const [candidateName, setCandidateName] = useState("");

  const [skillCount, setSkillCount] = useState(0);

  const [topicCount, setTopicCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await api.get("/skills");

        const skills = response.data.data;

        setSkillCount(skills.length);

        const topics = new Set(
          skills.map((skill) => skill.topic?.id).filter(Boolean),
        );

        setTopicCount(topics.size);
      } catch (err) {
        console.error(err);

        setError("Unable to load SkillGraph data.");
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleStart = () => {
    const name = candidateName.trim();

    if (!name) {
      return;
    }

    sessionStorage.setItem("candidateName", name);

    navigate("/assessment");
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <Text className="brand">SkillGraph</Text>

        <Title>Discover what you know. Understand what to learn next.</Title>

        <Paragraph className="hero-description">
          Take a developer skill assessment and let the skill graph identify
          strengths, weaknesses and learning dependencies.
        </Paragraph>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          className="section-spacing"
        />
      )}

      <Row gutter={[20, 20]} className="section-spacing">
        <Col xs={24} md={12}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Skills in graph"
                value={skillCount}
                prefix={<NodeIndexOutlined />}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Knowledge areas"
                value={topicCount}
                prefix={<DeploymentUnitOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="action-cards">
        <Col xs={24} md={12}>
          <Card className="action-card">
            <Title level={3}>Start your assessment</Title>

            <Paragraph>
              Answer a short set of developer questions. Your responses will be
              mapped to skills in CognoDB.
            </Paragraph>

            <Input
              size="large"
              placeholder="Enter your name"
              value={candidateName}
              onChange={(event) => setCandidateName(event.target.value)}
              onPressEnter={handleStart}
            />

            <Button
              type="primary"
              size="large"
              block
              className="start-button"
              disabled={!candidateName.trim()}
              onClick={handleStart}
              icon={<ArrowRightOutlined />}
            >
              Start Assessment
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="action-card">
            <Title level={3}>Explore the Skill Graph</Title>

            <Paragraph>
              See how developer skills depend on each other and discover the
              learning path for technologies like React, Next.js and JWT.
            </Paragraph>

            <Button
              size="large"
              block
              onClick={() => navigate("/explore")}
              icon={<DeploymentUnitOutlined />}
            >
              Explore Skill Graph
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
