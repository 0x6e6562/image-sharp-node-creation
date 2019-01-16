import React from 'react';
import { graphql } from 'gatsby';

export default ({ data }) =>
  <div>
    {data.allFeature.edges.map(({node: { id, description, fluid: { src } }}) => (
      <div key={id}>
        <h1>{description}</h1>
        <img src={src} />
      </div>
    ))}
  </div>

export const query = graphql`
  query FeatureQuery {
    allFeature {
      totalCount
      edges {
        node {
          id
          description
          fluid {
            src
          }
        }
      }
    }
  }
`
