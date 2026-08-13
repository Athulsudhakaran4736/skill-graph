import { useEffect, useState } from "react";

import { Alert, Button, Card, Empty, Select, Spin, Typography } from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import SkillGraphView from "../components/SkillGraphView";

const { Title, Paragraph, Text } = Typography;

function SkillExplorerPage() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);

  const [selectedSkill, setSelectedSkill] = useState("nextjs");

  const [graph, setGraph] = useState(null);

  const [loadingSkills, setLoadingSkills] = useState(true);

  const [loadingGraph, setLoadingGraph] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await api.get("/skills");

        setSkills(response.data.data);
      } catch (err) {
        console.error(err);

        setError("Unable to load skills.");
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    if (!selectedSkill) {
      return;
    }

    const loadGraph = async () => {
      try {
        setLoadingGraph(true);
        setError("");

        const response = await api.get(`/skills/${selectedSkill}/graph`);

        setGraph(response.data.data);
      } catch (err) {
        console.error(err);

        setGraph(null);

        setError("Unable to load the skill graph.");
      } finally {
        setLoadingGraph(false);
      }
    };

    loadGraph();
  }, [selectedSkill]);

  return (
    <div className="page-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
      >
        Dashboard
      </Button>

      <div className="explorer-header">
        <Text className="brand">SkillGraph</Text>

        <Title>Explore Skill Dependencies</Title>

        <Paragraph>
          Select a technology to see the knowledge graph of skills required to
          learn it.
        </Paragraph>
      </div>

      <Card className="explorer-controls">
        <Text strong>I want to learn</Text>

        <Select
          showSearch
          loading={loadingSkills}
          value={selectedSkill}
          onChange={setSelectedSkill}
          optionFilterProp="label"
          className="skill-selector"
          options={skills.map((skill) => ({
            value: skill.id,
            label: skill.name,
          }))}
        />
      </Card>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          className="section-spacing"
        />
      )}

      <Card className="graph-card">
        {loadingGraph ? (
          <div className="graph-loading">
            <Spin size="large" />
          </div>
        ) : graph ? (
          <>
            <div className="graph-summary">
              <div>
                <Text type="secondary">Selected skill</Text>

                <Title level={4}>
                  {
                    graph.nodes.find((node) => node.id === graph.rootSkillId)
                      ?.name
                  }
                </Title>
              </div>

              <div>
                <Text type="secondary">Prerequisites</Text>

                <Title level={4}>{Math.max(graph.nodes.length - 1, 0)}</Title>
              </div>
            </div>

            <SkillGraphView graph={graph} />
          </>
        ) : (
          <Empty description="No graph data available" />
        )}
      </Card>

      <Card className="graph-explanation">
        <Title level={4}>How to read this graph</Title>

        <Paragraph>
          The selected skill appears at the top. Follow the
          <strong> requires </strong>
          relationships downward to see the prerequisite knowledge needed to
          reach it.
        </Paragraph>
      </Card>
    </div>
  );
}

export default SkillExplorerPage;
